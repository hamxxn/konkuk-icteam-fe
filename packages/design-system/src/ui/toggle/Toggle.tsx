import { cn } from '@konkuk-icteam-fe/design-system/cn';

type ToggleProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'onClick' | 'type'
> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  // 스위치 왼쪽에 보이는 글자. 없으면 aria-label로 이름을 붙인다
  label?: string;
};

// 켜고 끄는 스위치. 누를 때마다 checked를 뒤집어 onCheckedChange로 알린다
export default function Toggle({
  checked,
  onCheckedChange,
  label,
  className,
  ...props
}: ToggleProps) {
  return (
    <button
      {...props}
      type='button'
      role='switch'
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'caption-14-md inline-flex cursor-pointer items-center gap-[0.8rem] text-black disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
    >
      {label ? <span>{label}</span> : null}
      <span
        aria-hidden
        className={cn(
          'flex h-[2.4rem] w-[4rem] items-center rounded-full px-[0.4rem] transition-colors duration-200',
          checked ? 'bg-black' : 'bg-gray-400',
        )}
      >
        <span
          className={cn(
            'bg-black-1 h-[1.6rem] w-[1.6rem] rounded-full transition-transform duration-200',
            checked ? 'translate-x-[1.6rem]' : 'translate-x-0',
          )}
        />
      </span>
    </button>
  );
}
