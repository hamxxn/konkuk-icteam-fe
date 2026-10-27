import type { TimeTableCell, TimeTableDay } from '../types';
import Day from './Day';
import TimeColumn from './TimeColumn';

type TimeTableProps = {
  days: TimeTableDay[];
  // 요일별 칸 목록. useTimeTable이 계산한 값을 그대로 넘긴다.
  cells: TimeTableCell[][];
};

// 주간 시간표 카드. 계산은 화면에서 useTimeTable로 끝내고, 여기서는 그리기만 한다.
export default function TimeTable({ days, cells }: TimeTableProps) {
  return (
    <div className='bg-black-1 flex items-start gap-[0.4rem] rounded-[1.2rem] border border-gray-400/30 px-[1.2rem] py-[1.6rem]'>
      <TimeColumn />
      {days.map((day, dayIndex) => (
        <Day key={day.date} day={day} cells={cells[dayIndex] ?? []} />
      ))}
    </div>
  );
}
