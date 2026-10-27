import type { TimeTableCell, TimeTableDay } from '../types';
import SlotCell from './Hour';

type DayProps = {
  day: TimeTableDay;
  cells: TimeTableCell[];
};

// 요일 한 칸: 요일 이름과 날짜, 그 아래로 하루치 슬롯을 세로로 늘어놓는다.
export default function Day({ day, cells }: DayProps) {
  return (
    <div className='flex flex-1 flex-col items-center'>
      <span className='caption-14-bd text-black'>{day.label}</span>
      <span className='caption-11-md text-blue'>{day.dateLabel}</span>
      <div className='flex w-full flex-col items-center gap-[0.4rem] pt-[0.8rem]'>
        {cells.map((cell) => (
          <SlotCell key={cell.key} cell={cell} />
        ))}
      </div>
    </div>
  );
}
