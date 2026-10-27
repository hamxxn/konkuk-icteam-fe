import { ArrowButton } from '@/shared/ui';
import { formatWeekRange } from '../_utils/week';

type WeekNavigatorProps = {
  weekStartKey: string;
  onMove: (delta: number) => void;
};

// 양 끝 화살표로 주를 옮기고, 가운데에 그 주의 월~금 날짜를 보여 준다
export default function WeekNavigator({ weekStartKey, onMove }: WeekNavigatorProps) {
  return (
    <div className='flex items-center gap-[2rem]'>
      <ArrowButton direction='left' size='medium' aria-label='이전 주' onClick={() => onMove(-1)} />
      <h2 className='title-20-sb min-w-[26rem] text-center text-black'>
        {formatWeekRange(weekStartKey)}
      </h2>
      <ArrowButton direction='right' size='medium' aria-label='다음 주' onClick={() => onMove(1)} />
    </div>
  );
}
