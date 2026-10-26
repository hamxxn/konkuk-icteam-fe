import { IconArrowDown } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Button, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { useState } from 'react';
import { getMe } from '@/shared/apis/me';
import type { TodoPeriod } from '@/shared/apis/todos';
import type { WorkShift } from '@/shared/apis/workShifts';
import { LATE_LIMIT_MINUTES } from '@/shared/config/workHours';
import { WORK_SHIFT_LABEL, WORK_STATUS_LABEL, WORK_STATUS_TONE } from '../_constants';
import { useDailyTodos } from '../_hooks';
import type { WorkShiftView } from '../_types';
import DailyTaskPanel from './DailyTaskPanel';

type WorkScheduleCardProps = {
  shifts: WorkShiftView[];
  // 근무 날짜 (YYYY-MM-DD)
  date: string;
  onClockIn: (shift: WorkShift) => void;
};

// 고른 날의 근무 일정. 지금 출근할 근무에는 출근 버튼이 붙고, 근무중인 근무를 펼치면 그 시간대 업무가 보인다
export default function WorkScheduleCard({ shifts, date, onClockIn }: WorkScheduleCardProps) {
  // 펼친 근무. 근무는 오전·오후 하나씩이라 시간대로 구분한다
  const [expandedPeriod, setExpandedPeriod] = useState<TodoPeriod | null>(null);
  const [{ userId: myUserId }] = useState(getMe);
  const { getTodosByPeriod, handleToggleTodo } = useDailyTodos(date);

  const handleToggleShift = (period: TodoPeriod) => {
    setExpandedPeriod((prev) => (prev === period ? null : period));
  };

  return (
    <div className='rounded-[0.6rem] border border-gray-50 px-[2rem] py-[1.6rem]'>
      <h2 className='caption-12-md text-gray-400'>근무 일정</h2>

      {shifts.length === 0 ? (
        <p className='caption-12-rg flex min-h-[4.8rem] items-center justify-center text-gray-400'>
          예정된 근무가 없습니다
        </p>
      ) : (
        <ul className='mt-[1.6rem] divide-y divide-gray-50'>
          {shifts.map((shift) => (
            <WorkShiftItem
              key={shift.period}
              shift={shift}
              isExpanded={shift.period === expandedPeriod}
              onToggle={() => handleToggleShift(shift.period)}
              onClockIn={() => onClockIn(shift)}
            >
              <DailyTaskPanel
                todos={getTodosByPeriod(shift.period)}
                myUserId={myUserId}
                onToggleTodo={handleToggleTodo}
              />
            </WorkShiftItem>
          ))}
        </ul>
      )}
      <p className='caption-11-md mt-[1.6rem] border-t border-gray-50 pt-[1.2rem] text-gray-400'>
        {`누적 지각이 ${LATE_LIMIT_MINUTES}분을 넘으면 장학금에 불이익이 있을 수 있어요. 출근하면 꼭 체크해 주세요.`}
      </p>
    </div>
  );
}

type WorkShiftItemProps = {
  shift: WorkShiftView;
  isExpanded: boolean;
  onToggle: () => void;
  onClockIn: () => void;
  // 펼쳤을 때 아래에 보여 줄 내용 (업무 사항)
  children: React.ReactNode;
};

// 근무 한 줄. 근무중이면 눌러서 펼칠 수 있고, 지금 출근할 수 있으면 상태 대신 출근 버튼을 보여 준다
const WorkShiftItem = ({
  shift,
  isExpanded,
  onToggle,
  onClockIn,
  children,
}: WorkShiftItemProps) => {
  // 근무중인 근무만 펼칠 수 있다. 출근 버튼은 출근 전 근무에만 나와서 펼치기 버튼과 겹치지 않는다
  const isExpandable = shift.workStatusCode === 'WK02';
  const rowClassName = 'flex w-full items-center justify-between gap-[1.2rem]';

  const rowContent = (
    <>
      <span className='flex flex-col gap-[0.4rem] text-left'>
        <span className='caption-14-md text-black'>{WORK_SHIFT_LABEL[shift.period]}</span>
        <span className='caption-12-rg text-gray-400'>{`${shift.start} - ${shift.end}`}</span>
      </span>
      <span className='flex shrink-0 items-center gap-[1.2rem]'>
        {shift.canClockIn ? (
          <Button display='inline' size='small' onClick={onClockIn}>
            출근하기
          </Button>
        ) : (
          <StateChip
            label={WORK_STATUS_LABEL[shift.workStatusCode]}
            tone={WORK_STATUS_TONE[shift.workStatusCode]}
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
