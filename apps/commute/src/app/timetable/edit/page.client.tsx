'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@konkuk-icteam-fe/design-system/cn';
import {
  BottomCTAButton,
  Button,
  ConfirmModal,
  ResultModal,
} from '@konkuk-icteam-fe/design-system/ui';

import TimeTable from '@/shared/components/timetable/base/Week';
import { useTimeTable } from '@/shared/components/timetable/hooks/useTimeTable';
import { useTimeTableWeek } from '@/shared/components/timetable/hooks/useTimeTableWeek';

import WeekNavigator from '../_components/WeekNavigator';
import WorkRuleNotice from '../_components/WorkRuleNotice';
import BackHeader from '../_components/BackHeader';
import SlotLegend from '../_components/SlotLegend';
import { EDIT_LEGEND_ITEMS } from '../_constants/slotLegend';
import { useLeaveGuard } from '../_hooks/useLeaveGuard';
import { SCHEDULE_CHANGE_RULES } from '@/shared/config/workHours';

// 근로시간 수정 요청 화면. 칸을 눌러 추가·삭제 예정을 표시하고 한 번에 요청한다.
export default function PageClient() {
  const router = useRouter();
  const [today] = useState(() => new Date());
  const tableWeek = useTimeTableWeek(today);
  const { days, cells, changedSlots, resetEdits } = useTimeTable('edit', tableWeek.dates);

  const hasChangedSlots = changedSlots.length > 0;
  // 이번 달에 이미 보낸 변경 요청 수. 한 달 한도를 다 쓰면 더 요청할 수 없다
  // todo: 이번 달 변경 요청 횟수 조회 API로 교체
  const usedChangeCount = 1;
  const isChangeLimitReached = usedChangeCount >= SCHEDULE_CHANGE_RULES.maxPerMonth;
  const [isRequestDoneModalOpen, setIsRequestDoneModalOpen] = useState(false);
  const { isLeaveModalOpen, setIsLeaveModalOpen, handleBack, handleLeave } =
    useLeaveGuard(hasChangedSlots);

  // 수정 요청은 관리자가 승인해야 반영된다. 보내면 완료 모달만 띄운다.
  // todo: 수정 요청 API에 changedSlots를 보내고, 성공했을 때 모달을 연다
  const handleSubmit = () => {
    setIsRequestDoneModalOpen(true);
  };

  // 확인 버튼·바깥 클릭·ESC 어느 쪽으로 닫아도 메인으로 돌아간다
  const handleRequestDoneModalOpenChange = (open: boolean) => {
    setIsRequestDoneModalOpen(open);

    if (!open) router.replace('/');
  };

  return (
    <div className='flex w-full flex-col gap-[2rem] px-[2rem] py-[2.4rem]'>
      <BackHeader
        title='근로시간 수정 요청'
        year={tableWeek.year}
        month={tableWeek.month}
        onBack={handleBack}
      />
      <div className='flex justify-center'>
        <WeekNavigator
          week={tableWeek.week}
          isPrevWeekDisabled={tableWeek.isPrevWeekDisabled}
          isNextWeekDisabled={tableWeek.isNextWeekDisabled}
          onPrevWeek={tableWeek.handlePrevWeek}
          onNextWeek={tableWeek.handleNextWeek}
        />
      </div>
      <p
        className={cn(
          'caption-12-md -mt-[1.2rem] text-center',
          isChangeLimitReached ? 'text-red' : 'text-gray-500',
        )}
      >
        {isChangeLimitReached
          ? `이번 달 변경 요청 ${SCHEDULE_CHANGE_RULES.maxPerMonth}회를 모두 사용했어요`
          : `이번 달 변경 요청 ${usedChangeCount}/${SCHEDULE_CHANGE_RULES.maxPerMonth}회 사용`}
      </p>

      <TimeTable days={days} cells={cells} />

      <WorkRuleNotice
        notices={[
          `일정 변경은 한 달에 최대 ${SCHEDULE_CHANGE_RULES.maxPerMonth}번, 근로 시작 ${SCHEDULE_CHANGE_RULES.deadlineHours}시간 전까지 요청할 수 있어요.`,
          `지각·결근 뒤 요청과 ${SCHEDULE_CHANGE_RULES.maxPerMonth}번을 넘는 요청은 반려되고, 대체 근로는 배정되지 않아요.`,
        ]}
      >
        <SlotLegend items={EDIT_LEGEND_ITEMS} />
      </WorkRuleNotice>
      <BottomCTAButton>
        <BottomCTAButton.Double
          leftButton={
            <Button tone='subtle_2' color='black' disabled={!hasChangedSlots} onClick={resetEdits}>
              초기화
            </Button>
          }
          rightButton={
            <Button
              color='blue'
              disabled={!hasChangedSlots || isChangeLimitReached}
              onClick={handleSubmit}
            >
              수정 요청
            </Button>
          }
        />
      </BottomCTAButton>
      <ConfirmModal
        open={isLeaveModalOpen}
        handleOpenChange={setIsLeaveModalOpen}
        title='수정을 그만두고 나갈까요?'
        description='표시한 추가·삭제 내용은 저장되지 않아요.'
        buttons={[
          { label: '계속 수정', tone: 'subtle_2', color: 'black' },
          { label: '나가기', color: 'red', onClick: handleLeave },
        ]}
      />
      <ResultModal
        open={isRequestDoneModalOpen}
        handleOpenChange={handleRequestDoneModalOpenChange}
        type='success'
        title='수정 요청이 완료되었어요'
        description={
          '관리자가 승인하면 시간표에 반영돼요.\n요청 사실을 카카오톡 1:1 채팅으로 꼭 알려 주세요.'
        }
        descriptionClassName='whitespace-pre-line text-center'
        buttons={[{ label: '확인', color: 'blue' }]}
      />
    </div>
  );
}
