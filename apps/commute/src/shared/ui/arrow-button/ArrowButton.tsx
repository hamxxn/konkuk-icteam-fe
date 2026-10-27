import { IconArrowLeft, IconArrowRight } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { IconButton } from '@konkuk-icteam-fe/design-system/ui';

type ArrowButtonProps = Omit<React.ComponentProps<typeof IconButton>, 'children'> & {
  direction: 'left' | 'right';
  size?: 'small' | 'medium';
};

const SIZE_CLASS_NAME = {
  small: 'h-[2.4rem] w-[2.4rem]',
  medium: 'h-[3.2rem] w-[3.2rem]',
};

// 이전/다음 이동에 쓰는 원형 화살표 버튼
export default function ArrowButton({
  direction,
  size = 'small',
  className,
  ...props
}: ArrowButtonProps) {
  const Icon = direction === 'left' ? IconArrowLeft : IconArrowRight;

  return (
    <IconButton
      className={cn(
        'flex items-center justify-center rounded-full border border-gray-50 text-black',
        SIZE_CLASS_NAME[size],
        className,
      )}
      {...props}
    >
      <Icon aria-hidden='true' className='h-[2rem] w-[2rem]' />
    </IconButton>
  );
}
