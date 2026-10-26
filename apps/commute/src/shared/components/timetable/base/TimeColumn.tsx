import { SLOT_START_TIMES } from '../constants';

// 정시 칸('09:00')에만 시(9)를 붙이고, 30분 칸은 비워둔다.
const getHourLabel = (startTime: string) => {
  const [hours, minutes] = startTime.split(':');

  return minutes === '00' ? String(Number(hours)) : '';
};

// 표 가장 왼쪽의 시간 열. 요일 열과 같은 높이로 줄을 맞춘다.
export default function TimeColumn() {
  return (
    <div aria-hidden className='flex w-[1.6rem] shrink-0 flex-col items-end'>
      {/* 요일 열 머리(요일·날짜)와 높이를 맞추기 위한 빈 자리 */}
      <span className='caption-14-bd invisible'>-</span>
      <span className='caption-11-md invisible'>-</span>
      <div className='flex w-full flex-col gap-[0.4rem] pt-[0.8rem]'>
        {SLOT_START_TIMES.map((startTime) => (
          <div key={startTime} className='relative h-[2.8rem] w-full'>
            <span className='caption-10-md absolute top-0 right-0 text-gray-500'>
              {getHourLabel(startTime)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
