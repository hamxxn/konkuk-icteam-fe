import { IconClose } from '@konkuk-icteam-fe/design-system/assets';
import { IconButton } from '@konkuk-icteam-fe/design-system/ui';
import type { Worker } from '../../_apis/workers';
import type { ScheduleDay } from '../_hooks/useWeekSchedule';
import { formatWorkDuration, getWorkerTimeRanges } from '../_utils/workerTimeRanges';
import { formatMonthDayWithWeekday } from '@/shared/utils/formatDate';

type WorkerTimePanelProps = {
  worker: Worker;
  // 지금 보고 있는 주의 시간표
  days: ScheduleDay[];
  onClose: () => void;
};

// 이름으로 찾은 근로학생의 이번 주 근무 시간. 날짜마다 이어진 근무와 길이, 맨 위에 주 합계를 보여 준다.
// X를 누르면 찾기를 풀고 시간표 강조도 사라진다
export default function WorkerTimePanel({ worker, days, onClose }: WorkerTimePanelProps) {
  const ranges = getWorkerTimeRanges(days, worker.userId);
  const totalMinutes = ranges.reduce((sum, { minutes }) => sum + minutes, 0);

  return (
    <aside className='bg-black-1 flex flex-col gap-[1.2rem] rounded-[1.6rem] border border-gray-50 p-[2.4rem] shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]'>
      <div className='flex items-center justify-between gap-[0.8rem]'>
        <h2 className='font-18-md text-black'>
          {worker.name}
          <span className='caption-14-md text-blue ml-[0.6rem]'>
            {`이번 주 ${formatWorkDuration(totalMinutes)}`}
          </span>
        </h2>
        <IconButton aria-label={`${worker.name} 찾기 풀기`} className='group' onClick={onClose}>
          <IconClose
            aria-hidden
            className='h-[1.6rem] w-[1.6rem] text-gray-400 group-hover:text-black'
          />
        </IconButton>
      </div>

      {ranges.length === 0 ? (
        <p className='caption-14-rg py-[1.2rem] text-gray-400'>이번 주 근무가 없어요.</p>
      ) : (
        <ul className='flex flex-col gap-[0.6rem]'>
          {ranges.map(({ dateKey, start, end, minutes }) => (
            <li
              key={`${dateKey}-${start}`}
              className='caption-14-md flex items-center gap-[0.8rem] rounded-[0.8rem] bg-gray-50/60 px-[1rem] py-[0.8rem] whitespace-nowrap text-black'
            >
              <span className='shrink-0'>{formatMonthDayWithWeekday(dateKey)}</span>
              <span className='flex-1'>{`${start}~${end}`}</span>
              <span className='caption-12-md text-blue shrink-0'>
                {formatWorkDuration(minutes)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
