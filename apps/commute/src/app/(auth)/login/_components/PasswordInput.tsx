'use client';

import { useState } from 'react';
import { IconEye, IconEyeOff } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { IconButton, Input } from '@konkuk-icteam-fe/design-system/ui';

// 보이기·숨기기는 이 칸이 정하므로 type은 받지 않는다
type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>;

// 비밀번호 칸. 오른쪽 눈 버튼으로 입력한 비밀번호를 보였다 숨긴다
export default function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className='relative'>
      <Input
        type={isVisible ? 'text' : 'password'}
        className={cn('pr-[4.4rem]', className)}
        {...props}
      />
      <IconButton
        aria-label='비밀번호 보기'
        aria-pressed={isVisible}
        className='absolute top-1/2 right-[1.2rem] -translate-y-1/2 text-gray-400 hover:text-black'
        onClick={() => setIsVisible((prevIsVisible) => !prevIsVisible)}
      >
        {isVisible ? (
          <IconEyeOff aria-hidden className='h-[2rem] w-[2rem]' />
        ) : (
          <IconEye aria-hidden className='h-[2rem] w-[2rem]' />
        )}
      </IconButton>
    </div>
  );
}
