'use client';

import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { Dropdown } from '@konkuk-icteam-fe/design-system/ui';
import type { TimeString } from '@/app/(student)/_apis/common';
import type { OnDutyWorker } from '../../_utils/getWorkersByPeriod';
import { getTaskStartOptions, getWorkersAt } from '../../_utils/taskTime';

type AssigneePickerProps = {
  // 업무 이름. 묶음을 읽어 줄 때 쓴다
  title: string;
  // 그 시간대 근무자
  workers: OnDutyWorker[];
  // 고른 업무 시작 시각. 아직 고르지 않았으면 null
  start: TimeString | null;
  // 맡긴 근로학생 id
  userIds: number[];
  // 근로학생 id → 이 업무를 지금까지 한 횟수
  countByUserId: Record<number, number>;
  onStartChange: (start: TimeString) => void;
  onToggle: (userId: number) => void;
};

// 업무 지정 칸에서 지정을 누르면 펼치는 회색 상자. 먼저 업무 시작 시각을 고르고,
// 그 아래에서 그 시각에 근무하는 사람을 눌러 맡기거나 뺀다. 이름 옆 괄호는 이 업무를 지금까지 한 횟수다
export default function AssigneePicker({
  title,
  workers,
  start,
  userIds,
  countByUserId,
  onStartChange,
  onToggle,
}: AssigneePickerProps) {
  const availableWorkers = start ? getWorkersAt(workers, start) : [];

  return (
    <div
      role='group'
      aria-label={`${title} 근로학생 선택`}
      className='mt-[0.8rem] flex flex-col gap-[1.2rem] rounded-[0.8rem] bg-gray-50 p-[1.2rem]'
    >
      <div className='flex items-center gap-[1rem]'>
        <span className='caption-14-md shrink-0 text-gray-700'>시작 시각</span>
        <div className='w-[12rem]'>
          <Dropdown
            options={getTaskStartOptions(workers)}
            placeholder='시간 선택'
            value={start ?? ''}
            triggerClassName='px-[1rem]'
            optionWrapperClassName='relative z-30'
            onChange={onStartChange}
          />
        </div>
      </div>

      {start ? (
        <div className='flex flex-wrap gap-[0.6rem]'>
          {availableWorkers.map(({ userId, userName }) => {
            const isAssigned = userIds.includes(userId);

            return (
              <button
                key={userId}
                type='button'
                aria-pressed={isAssigned}
                className={cn(
                  'caption-12-md cursor-pointer rounded-full border px-[1rem] py-[0.4rem] transition-colors',
                  isAssigned
                    ? 'border-blue bg-blue text-black-1'
                    : 'bg-black-1 hover:border-blue border-gray-400 text-gray-700',
                )}
                onClick={() => onToggle(userId)}
              >
                {`${userName} (${countByUserId[userId] ?? 0})`}
              </button>
            );
          })}
        </div>
      ) : (
        <p className='caption-12-md text-gray-500'>
          시작 시각을 고르면 그때 근무하는 사람이 보여요.
        </p>
      )}
    </div>
  );
}
