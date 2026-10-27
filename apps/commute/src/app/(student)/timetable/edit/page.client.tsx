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

import { parseISO } from '@konkuk-icteam-fe/design-system/date';

import { getWorkApplicationSettings } from '@/shared/apis/workApplications';
import { createWorkChangeRequest, getMyWorkChangeRequests } from '@/shared/apis/workChangeRequests';
import TimeTable from '@/shared/components/timetable/base/Week';
import { useTimeTable } from '@/shared/components/timetable/hooks/useTimeTable';
import { useTimeTableWeek } from '@/shared/components/timetable/hooks/useTimeTableWeek';
import type { SlotEdit } from '@/shared/components/timetable/types';
import { mergeSlotsToRanges } from '@/shared/components/timetable/utils';
import { getMonthWeekInfo } from '@/shared/utils/week';
import { ROUTES } from '@/shared/config/routes';
import { SLOT_MINUTES } from '@/shared/config/slot';
import { SCHEDULE_CHANGE_RULES } from '@/shared/config/workHours';

import BackHeader from '../_components/BackHeader';
import SlotLegend from '../_components/SlotLegend';
import WeekNavigator from '../_components/WeekNavigator';
import WorkRuleNotice from '../_components/WorkRuleNotice';
import { EDIT_LEGEND_ITEMS } from '../_constants/slotLegend';
import { useLeaveGuard } from '../_hooks/useLeaveGuard';
import { createScheduleSource } from '../_lib/createTimeTableSource';
import ChangeRequestModal from './_components/ChangeRequestModal';

const HOUR_MS = 60 * 60 * 1000;

/**
 * 같은 상태로 바꾼 칸을 이어진 근무 구간으로 묶습니다.
 * @param slots 바꾼 칸 목록
 * @param status 고를 상태 (추가 예정·삭제 예정)
 * @returns 근무 구간 목록
 * @example createChangedRanges(changedSlots, 'PENDING_ADD');
 */
const createChangedRanges = (slots: SlotEdit[], status: SlotEdit['status']) =>
  mergeSlotsToRanges(
    slots.filter((slot) => slot.status === status),
    SLOT_MINUTES,
  ).map((range) => ({ ...range, date: parseISO(range.date) }));

// 근로시간 수정 요청 화면. 칸을 눌러 추가·삭제 예정을 표시하고 한 번에 요청한다.
export default function PageClient() {
  const router = useRouter();
  const [today] = useState(() => new Date());
  const tableWeek = useTimeTableWeek(today);
  // 이번 달 근무와 기준, 이번 달 보낸 변경 요청 수. 근로 시작 몇 시간 전까지만 바꿀 수 있다
  const [{ source, settings, usedChangeCount }] = useState(() => {
    const { year, month } = getMonthWeekInfo(today);

    return {
      source: createScheduleSource({
        year,
        month,
        editableFrom: new Date(today.getTime() + SCHEDULE_CHANGE_RULES.deadlineHours * HOUR_MS),
      }),
      settings: getWorkApplicationSettings({ year, month }).settings,
      usedChangeCount: getMyWorkChangeRequests({ year, month }).requests.length,
    };
  });
  const { days, cells, changedSlots, resetEdits } = useTimeTable('edit', tableWeek.dates, source);

  const hasChangedSlots = changedSlots.length > 0;
  // 한 달 한도를 다 쓰면 더 요청할 수 없다
  const isChangeLimitReached = usedChangeCount >= SCHEDULE_CHANGE_RULES.maxPerMonth;
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isRequestDoneModalOpen, setIsRequestDoneModalOpen] = useState(false);
  const { isLeaveModalOpen, setIsLeaveModalOpen, handleBack, handleLeave } =
    useLeaveGuard(hasChangedSlots);
  const deleteSchedules = createChangedRanges(changedSlots, 'PENDING_DELETE');
  const addSchedules = createChangedRanges(changedSlots, 'PENDING_ADD');

  // 수정 요청은 관리자가 승인해야 반영된다. 사유를 받아 보내고 완료 모달을 띄운다
  const handleSubmit = (reason: string) => {
    createWorkChangeRequest({ reason, deleteSchedules, addSchedules });
    setIsReasonModalOpen(false);
    setIsRequestDoneModalOpen(true);
  };

  // 확인 버튼·바깥 클릭·ESC 어느 쪽으로 닫아도 메인으로 돌아간다
  const handleRequestDoneModalOpenChange = (open: boolean) => {
    setIsRequestDoneModalOpen(open);

    if (!open) router.replace(ROUTES.HOME);
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
        settings={settings}
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
              onClick={() => setIsReasonModalOpen(true)}
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
      <ChangeRequestModal
        open={isReasonModalOpen}
        deleteSchedules={deleteSchedules}
        addSchedules={addSchedules}
        onClose={() => setIsReasonModalOpen(false)}
        onSubmit={handleSubmit}
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
