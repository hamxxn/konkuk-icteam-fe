'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@konkuk-icteam-fe/design-system/cn';
import {
  BottomCTAButton,
  Button,
  ConfirmModal,
  ResultModal,
} from '@konkuk-icteam-fe/design-system/ui';

import { parseISO } from '@konkuk-icteam-fe/design-system/date';

import { saveMyWorkApplication } from '@/shared/apis/workApplications';
import TimeTable from '../_components/timetable/base/Week';
import { useTimeTable } from '../_components/timetable/hooks/useTimeTable';
import { useTimeTableWeek } from '../_components/timetable/hooks/useTimeTableWeek';
import { mergeSlotsToRanges } from '../_components/timetable/utils';
import { getFirstWeekMonday } from '@/shared/utils/week';
import { ROUTES } from '@/shared/config/routes';
import { SLOT_MINUTES } from '@/shared/config/slot';
import { MIN_WORK_HOURS_PER_SHIFT } from '@/shared/config/workHours';
import { useApplyPeriod } from '@/shared/hooks/useApplyPeriod';
import { formatMonthDay, formatMonthDayTime } from '@/shared/utils/formatDate';

import BackHeader from '../_components/BackHeader';
import SlotLegend from '../_components/SlotLegend';
import MonthWeekNavigator from '../_components/MonthWeekNavigator';
import WorkRuleNotice from '../_components/WorkRuleNotice';
import { APPLY_LEGEND_ITEMS } from '../_constants/slotLegend';
import { useLeaveGuard } from '../_hooks/useLeaveGuard';
import { createApplySource } from '../_lib/createTimeTableSource';

// 근로시간 신청 화면. 다음 달 근무 칸을 골라 한 번에 신청하고, 마감일까지는 다시 들어와 바꿀 수 있다.
export default function PageClient() {
  const router = useRouter();
  const applyPeriod = useApplyPeriod();
  // 다음 달 1주차 월요일. 주차 이동이 다음 달 안에서만 되도록 이 날짜를 기준으로 삼는다.
  const [baseDate] = useState(() => getFirstWeekMonday(applyPeriod.year, applyPeriod.month));
  const tableWeek = useTimeTableWeek(baseDate);
  // 다음 달 내가 신청해 둔 근무와 관리자가 정한 기준
  const [source] = useState(() =>
    createApplySource({
      year: applyPeriod.year,
      month: applyPeriod.month,
      editableFrom: new Date(),
    }),
  );
  const {
    days,
    cells,
    changedSlots,
    resetEdits,
    weekHours,
    isWeekFull,
    getShortShiftDates,
    getWorkingSlots,
  } = useTimeTable('apply', tableWeek.dates, source);
  const { settings } = applyPeriod;

  const hasChangedSlots = changedSlots.length > 0;
  const { isLeaveModalOpen, setIsLeaveModalOpen, handleBack, handleLeave } =
    useLeaveGuard(hasChangedSlots);
  const [shortShiftDates, setShortShiftDates] = useState<string[]>([]);
  const [isApplyDoneModalOpen, setIsApplyDoneModalOpen] = useState(false);

  // 신청 기간이 아니면(열리기 전·마감 후) 시간표로 돌려보낸다
  useEffect(() => {
    if (!applyPeriod.isApplyOpen) router.replace(ROUTES.TIMETABLE);
  }, [applyPeriod.isApplyOpen, router]);

  // 1회 최소 근무 시간을 못 채운 날이 있으면 신청하지 않고 알려 준다. 신청은 그 달 근무를 통째로 저장한다
  const handleSubmit = () => {
    const nextShortShiftDates = getShortShiftDates();

    if (nextShortShiftDates.length > 0) {
      setShortShiftDates(nextShortShiftDates);
      return;
    }

    saveMyWorkApplication({
      year: applyPeriod.year,
      month: applyPeriod.month,
      schedules: mergeSlotsToRanges(getWorkingSlots(), SLOT_MINUTES).map((range) => ({
        ...range,
        date: parseISO(range.date),
      })),
    });
    setIsApplyDoneModalOpen(true);
  };

  // 확인 버튼·바깥 클릭·ESC 어느 쪽으로 닫아도 메인으로 돌아간다
  const handleApplyDoneModalOpenChange = (open: boolean) => {
    setIsApplyDoneModalOpen(open);

    if (!open) router.replace(ROUTES.HOME);
  };

  return (
    <div className='flex w-full flex-col gap-[2rem] px-[2rem] py-[2.4rem]'>
      <BackHeader
        title='근로시간 신청'
        year={tableWeek.year}
        month={tableWeek.month}
        onBack={handleBack}
      />

      <div className='flex flex-col items-center gap-[0.6rem]'>
        <MonthWeekNavigator
          week={tableWeek.week}
          isPrevWeekDisabled={tableWeek.isPrevWeekDisabled}
          isNextWeekDisabled={tableWeek.isNextWeekDisabled}
          onPrevWeek={tableWeek.handlePrevWeek}
          onNextWeek={tableWeek.handleNextWeek}
        />
        {settings && (
          <p
            className={cn(
              'caption-12-md',
              isWeekFull || weekHours < settings.weeklyMinHours ? 'text-red' : 'text-gray-500',
            )}
          >
            {`이번 주 ${weekHours}시간 · 주 ${settings.weeklyMinHours}~${settings.weeklyMaxHours}시간`}
          </p>
        )}
      </div>

      <TimeTable days={days} cells={cells} />

      <WorkRuleNotice
        settings={settings}
        notices={[
          `${applyPeriod.month}월은 한 타임에 최대 ${settings?.maxConcurrentWorkers ?? 0}명까지 배정돼요. 다른 팀 회의 시간과 겹치지 않게 확인해 주세요.`,
        ]}
      >
        <SlotLegend items={APPLY_LEGEND_ITEMS} />
      </WorkRuleNotice>
      <BottomCTAButton>
        <BottomCTAButton.Double
          leftButton={
            <Button tone='subtle_2' color='black' disabled={!hasChangedSlots} onClick={resetEdits}>
              초기화
            </Button>
          }
          rightButton={
            <Button color='blue' disabled={!hasChangedSlots} onClick={handleSubmit}>
              신청하기
            </Button>
          }
        />
      </BottomCTAButton>
      <ConfirmModal
        open={isLeaveModalOpen}
        handleOpenChange={setIsLeaveModalOpen}
        title='신청을 그만두고 나갈까요?'
        description='고른 근무 시간은 저장되지 않아요.'
        buttons={[
          { label: '계속 신청', tone: 'subtle_2', color: 'black' },
          { label: '나가기', color: 'red', onClick: handleLeave },
        ]}
      />
      <ResultModal
        open={shortShiftDates.length > 0}
        handleOpenChange={(open) => !open && setShortShiftDates([])}
        type='error'
        title={`1회 최소 ${MIN_WORK_HOURS_PER_SHIFT}시간을 채워 주세요`}
        description={`${shortShiftDates.map(formatMonthDay).join(', ')}에 ${MIN_WORK_HOURS_PER_SHIFT}시간보다 짧은 근무가 있어요.`}
        buttons={[{ label: '확인', color: 'blue' }]}
      />
      <ResultModal
        open={isApplyDoneModalOpen}
        handleOpenChange={handleApplyDoneModalOpenChange}
        type='success'
        title='근로 신청이 완료되었어요'
        description={
          settings
            ? `${formatMonthDayTime(settings.applyEndDate)} 마감 전까지 다시 바꿀 수 있어요.`
            : undefined
        }
        buttons={[{ label: '확인', color: 'blue' }]}
      />
    </div>
  );
}
