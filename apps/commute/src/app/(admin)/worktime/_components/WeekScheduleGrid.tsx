import { Fragment } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import type { ScheduleCell, ScheduleDay } from '../_hooks/useWeekSchedule';

type WeekScheduleGridProps = {
  days: ScheduleDay[];
  // 한 칸에 함께 근무할 수 있는 최대 인원. 닿으면 빨간 테두리로 알린다
  maxConcurrentWorkers: number;
  // 칸 안에 그릴 내용 (배치된 사람과 편집 버튼). 몇 번째 요일 열인지도 넘긴다 (0 = 월)
  renderCell: (cell: ScheduleCell, columnIndex: number) => React.ReactNode;
  // 조회 대상이 있으면 그 사람이 없는 칸은 흐리게 한다
  focusedUserId?: number | null;
};

// 월~금 x 30분 단위 근무 시간표. 칸이 최대 인원에 닿으면 빨간 테두리로 알리고, 점심시간 칸은 막아 둔다
export default function WeekScheduleGrid({
  days,
  maxConcurrentWorkers,
  renderCell,
  focusedUserId = null,
}: WeekScheduleGridProps) {
  const times = days[0]?.cells.map(({ start }) => start) ?? [];

  return (
    <div className='grid grid-cols-[4.8rem_repeat(5,minmax(0,1fr))] gap-[0.8rem]'>
      <span aria-hidden />
      {days.map(({ dateKey, weekday, dateLabel }) => (
        <div key={dateKey} className='flex flex-col items-center gap-[0.2rem] pb-[0.4rem]'>
          <span className='title-20-bd text-black'>{weekday}</span>
          <span className='font-14-bd text-blue'>{dateLabel}</span>
        </div>
      ))}

      {times.map((time, timeIndex) => (
        <Fragment key={time}>
          <span className='caption-12-md pt-[1rem] text-gray-400'>{time}</span>
          {days.map(({ dateKey, cells }, columnIndex) => {
            const cell = cells[timeIndex];
            if (!cell) return <div key={`${dateKey}-${time}`} />;

            // 점심시간 칸은 인원 수도 편집 버튼도 없이 막아 둔다
            if (cell.isLunch) {
              return (
                <div
                  key={`${dateKey}-${time}`}
                  className='caption-12-md flex min-h-[8.4rem] items-center justify-center rounded-[1.2rem] bg-gray-50 text-gray-400'
                >
                  점심시간
                </div>
              );
            }

            const isFull = cell.users.length >= maxConcurrentWorkers;
            const isDimmed =
              focusedUserId !== null && !cell.users.some(({ userId }) => userId === focusedUserId);

            return (
              <div
                key={`${dateKey}-${time}`}
                className={cn(
                  'flex min-h-[8.4rem] flex-col gap-[0.6rem] rounded-[1.2rem] border p-[1rem] transition-opacity',
                  isFull ? 'border-red/30 bg-red/5' : 'border-gray-50',
                  isDimmed && 'opacity-30',
                )}
              >
                <span
                  className={cn(
                    'caption-12-md flex justify-end',
                    isFull ? 'text-red' : 'text-gray-400',
                  )}
                >{`${cell.users.length}/${maxConcurrentWorkers}`}</span>
                {renderCell(cell, columnIndex)}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
