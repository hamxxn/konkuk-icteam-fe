'use client';

import { useId } from 'react';
import { Input, Message } from '@konkuk-icteam-fe/design-system/ui';

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label?: string;
  message?: string;
  messageVariant?: 'help' | 'error' | 'success';
};

// 라벨 + 디자인 시스템 Input + 안내 문구를 한 묶음으로 쓴다
export default function TextField({
  label,
  message,
  messageVariant = 'help',
  ...inputProps
}: TextFieldProps) {
  const messageId = useId();

  return (
    <label className='flex flex-col gap-[0.6rem]'>
      {label && <span className='caption-14-md text-gray-700'>{label}</span>}
      <Input
        hasError={messageVariant === 'error' && !!message}
        aria-describedby={message ? messageId : undefined}
        aria-invalid={messageVariant === 'error' && !!message ? true : undefined}
        {...inputProps}
      />
      <Message id={messageId} message={message} variant={messageVariant} showIcon />
    </label>
  );
}
