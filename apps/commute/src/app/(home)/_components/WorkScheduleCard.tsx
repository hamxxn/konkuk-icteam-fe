import { IconArrowDown } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Button, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { useState } from 'react';
import { WORK_STATUS_LABEL, WORK_STATUS_TONE } from '../_constants';
import { useDailyTasks } from '../_hooks';
import { getTaskPeriod } from '../_lib';
import { WorkStatus, type WorkSchedule } from '../_types';
import { USER_INFO_MOCK } from '../mock';
import DailyTaskPanel from './DailyTaskPanel';

type WorkScheduleCardProps = {
  schedules: WorkSchedule[];
  // 근무 날짜 (YYYY-MM-DD)
  date: string;
  // 출근할 근무의 시작 시각을 넘긴다
  onClockIn: (start: string) => void;
};

// 고른 날의 근무 일정. 지금 출근할 근무에는 출근 버튼이 붙고, 근무중인 근무를 펼치면 그 시간대 업무가 보인다
export default function WorkScheduleCard({ schedules, date, onClockIn }: WorkScheduleCardProps) {
  // 펼친 근무의 시작 시각. 근무 시간대는 겹치지 않아서 시작 시각으로 근무를 구분한다
  const [expandedStart, setExpandedStart] = useState<string | null>(null);
  const { dailyTasks, handleToggleTask } = useDailyTasks(date, USER_INFO_MOCK.userName);

  const handleToggleSchedule = (start: string) => {
    setExpandedStart((prev) => (prev === start ? null : start));
  };

  return (
    <div className='rounded-[0.6rem] border border-gray-50 px-[2rem] py-[1.6rem]'>
      <h2 className='caption-12-md text-gray-400'>근무 일정</h2>

      {schedules.length === 0 ? (
        <p className='caption-12-rg flex min-h-[4.8rem] items-center justify-center text-gray-400'>
          예정된 근무가 없습니다
        </p>
      ) : (
        <ul className='mt-[1.6rem] divide-y divide-gray-50'>
          {schedules.map((schedule) => (
            <WorkScheduleItem
              key={schedule.start}
              schedule={schedule}
              isExpanded={schedule.start === expandedStart}
              onToggle={() => handleToggleSchedule(schedule.start)}
              onClockIn={() => onClockIn(schedule.start)}
            >
              <DailyTaskPanel
                tasks={dailyTasks[getTaskPeriod(schedule)]}
                onToggleTask={handleToggleTask}
              />
            </WorkScheduleItem>
          ))}
        </ul>
      )}
    </div>
  );
}

type WorkScheduleItemProps = {
  schedule: WorkSchedule;
  isExpanded: boolean;
  onToggle: () => void;
  onClockIn: () => void;
  // 펼쳤을 때 아래에 보여 줄 내용 (업무 사항)
  children: React.ReactNode;
};

// 근무 한 줄. 근무중이면 눌러서 펼칠 수 있고, 지금 출근할 수 있으면 상태 대신 출근 버튼을 보여 준다
const WorkScheduleItem = ({
  schedule,
  isExpanded,
  onToggle,
  onClockIn,
  children,
}: WorkScheduleItemProps) => {
  // 근무중인 근무만 펼칠 수 있다. 출근 버튼은 출근 전 근무에만 나와서 펼치기 버튼과 겹치지 않는다
  const isExpandable = schedule.workStatusCode === WorkStatus.WORKING;
  const rowClassName = 'flex w-full items-center justify-between gap-[1.2rem]';

  const rowContent = (
    <>
      <span className='flex flex-col gap-[0.4rem] text-left'>
        <span className='caption-14-md text-black'>{schedule.label}</span>
        <span className='caption-12-rg text-gray-400'>
          {`${schedule.start.slice(0, 5)} - ${schedule.end.slice(0, 5)}`}
        </span>
      </span>
      <span className='flex shrink-0 items-center gap-[1.2rem]'>
        {schedule.canClockIn ? (
          <Button display='inline' size='small' onClick={onClockIn}>
            출근하기
          </Button>
        ) : (
          <StateChip
            label={WORK_STATUS_LABEL[schedule.workStatusCode]}
            tone={WORK_STATUS_TONE[schedule.workStatusCode]}
          />
        )}
        {isExpandable && (
          <IconArrowDown
            aria-hidden='true'
            className={cn(
              'h-[2rem] w-[2rem] text-gray-500 transition-transform',
              isExpanded && 'rotate-180',
            )}
          />
        )}
      </span>
    </>
  );

  return (
    <li className='py-[1rem] first:pt-0 last:pb-0'>
      {isExpandable ? (
        <button
          type='button'
          aria-expanded={isExpanded}
          className={cn(rowClassName, 'cursor-pointer')}
          onClick={onToggle}
        >
          {rowContent}
        </button>
      ) : (
        <div className={rowClassName}>{rowContent}</div>
      )}
      {isExpandable && isExpanded && children}
    </li>
  );
};
