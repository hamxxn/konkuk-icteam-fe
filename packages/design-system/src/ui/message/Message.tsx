import { IconCheck, IconClose } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type FieldMessageVariant = 'help' | 'error' | 'success';

type MessageProps = {
  id: string;
  message?: string;
  variant?: FieldMessageVariant;
  showIcon?: boolean;
};

const MESSAGE_THEME: Record<FieldMessageVariant, string> = {
  help: 'text-gray-400',
  error: 'text-red',
  success: 'text-green',
};

export default function Message({ id, message, variant = 'help', showIcon }: MessageProps) {
  if (!message) return null;

  const role = variant === 'error' ? 'alert' : undefined;

  return (
    <div className='flex min-h-[2.4rem] flex-row items-center'>
      {showIcon && variant === 'error' && (
        <IconClose className={cn('h-[2.4rem] w-[2.4rem]', MESSAGE_THEME[variant])} aria-hidden />
      )}
      {showIcon && variant === 'success' && (
        <IconCheck
          className={cn('mx-[0.6rem] h-[1.2rem] w-[1.2rem]', MESSAGE_THEME[variant])}
          aria-hidden
        />
      )}
      <p className={cn('caption-10-md', MESSAGE_THEME[variant])} id={id} role={role}>
        {message}
      </p>
    </div>
  );
}
