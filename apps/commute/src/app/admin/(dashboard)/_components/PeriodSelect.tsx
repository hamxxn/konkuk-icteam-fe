import { cn } from '@konkuk-icteam-fe/design-system/cn';
import type { TodoPeriod } from '../../_apis/todos';
import { PERIODS } from '../../_constants/period';

type PeriodSelectProps = {
  value: TodoPeriod;
  onChange: (period: TodoPeriod) => void;
  className?: string;
};

// 업무 시간대(오전·오후) 고르기. 업무를 추가하거나 고칠 때 쓴다
export default function PeriodSelect({ value, onChange, className }: PeriodSelectProps) {
  return (
    <div className={cn('flex gap-[0.6rem]', className)}>
      {PERIODS.map((option) => (
        <button
          key={option.period}
          type='button'
          aria-pressed={value === option.period}
          className={cn(
            'caption-12-md h-[2.8rem] cursor-pointer rounded-[0.6rem] px-[1.2rem] transition-colors',
            value === option.period ? 'bg-blue text-black-1' : 'bg-gray-50 text-gray-500',
          )}
          onClick={() => onChange(option.period)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
