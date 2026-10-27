import { ArrowButton } from '@/shared/ui';

type MonthWeekNavigatorProps = {
  week: number;
  isPrevWeekDisabled: boolean;
  isNextWeekDisabled: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;
};

// 양 끝 원형 화살표 사이에 주차를 보여 준다. 이번 달 주차 끝에 닿으면 화살표가 막힌다.
export default function MonthWeekNavigator({
  week,
  isPrevWeekDisabled,
  isNextWeekDisabled,
  onPrevWeek,
  onNextWeek,
}: MonthWeekNavigatorProps) {
  return (
    <div className='flex items-center gap-[1.2rem]'>
      <ArrowButton
        direction='left'
        aria-label='이전 주차'
        disabled={isPrevWeekDisabled}
        onClick={onPrevWeek}
      />
      <span className='font-16-bd text-black'>{`${week}주차`}</span>
      <ArrowButton
        direction='right'
        aria-label='다음 주차'
        disabled={isNextWeekDisabled}
        onClick={onNextWeek}
      />
    </div>
  );
}
