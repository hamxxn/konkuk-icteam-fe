'use client';

import { useId, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Message } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import { USER_ROLE, type UserRole } from '@/shared/constants/userRole';
import { login, type LoginErrorCode } from '../../_apis/auth';
import { loginSchema, type LoginFormValues } from '../_lib/loginSchema';
import PasswordInput from './PasswordInput';

// 로그인에 실패했을 때 폼 아래에 보여 줄 글자. 메일이 없는지 비밀번호가 틀렸는지는 알려 주지 않는다
const LOGIN_ERROR_MESSAGE: Record<LoginErrorCode, string> = {
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 틀렸습니다.',
  PENDING_APPROVAL: '관리자가 가입을 승인하면 로그인할 수 있어요. 승인을 기다려 주세요.',
};

// 로그인한 뒤 역할에 따라 처음 보여 줄 화면
const HOME_ROUTE_BY_ROLE: Record<UserRole, string> = {
  [USER_ROLE.STUDENT]: ROUTES.HOME,
  [USER_ROLE.ADMIN]: ROUTES.ADMIN_HOME,
};

// 로그인 폼. 학교 메일과 비밀번호를 받고, 성공하면 역할에 맞는 홈으로 보낸다
export default function LoginForm() {
  const router = useRouter();
  // 로그인에 성공해 다음 화면으로 넘어가는 동안. 이때도 버튼을 로딩으로 두어 다시 누르지 못하게 한다
  const [isNavigating, startNavigation] = useTransition();
  const { formState, handleSubmit, register, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const fieldIdPrefix = useId();
  const emailError = formState.errors.email?.message;
  const passwordError = formState.errors.password?.message;
  const loginError = formState.errors.root?.message;

  const handleValidSubmit = (values: LoginFormValues) => {
    const result = login(values);
    if (!result.isSuccess) {
      setError('root', { message: LOGIN_ERROR_MESSAGE[result.errorCode] });
      return;
    }

    startNavigation(() => router.push(HOME_ROUTE_BY_ROLE[result.user.role]));
  };

  return (
    <form
      noValidate
      className='flex flex-col gap-[2.4rem]'
      onSubmit={(event) => void handleSubmit(handleValidSubmit)(event)}
    >
      <div className='flex flex-col gap-[1.6rem]'>
        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-email`} className='font-14-bd text-black'>
            학교 메일
          </label>
          <Input
            id={`${fieldIdPrefix}-email`}
            type='email'
            inputMode='email'
            autoComplete='username'
            placeholder='아이디@konkuk.ac.kr'
            hasError={emailError !== undefined}
            aria-invalid={emailError !== undefined}
            aria-describedby={`${fieldIdPrefix}-email-error`}
            {...register('email')}
          />
          <Message id={`${fieldIdPrefix}-email-error`} message={emailError} variant='error' />
        </div>

        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-password`} className='font-14-bd text-black'>
            비밀번호
          </label>
          <PasswordInput
            id={`${fieldIdPrefix}-password`}
            autoComplete='current-password'
            placeholder='비밀번호를 입력해 주세요'
            hasError={passwordError !== undefined}
            aria-invalid={passwordError !== undefined}
            aria-describedby={`${fieldIdPrefix}-password-error`}
            {...register('password')}
          />
          <Message id={`${fieldIdPrefix}-password-error`} message={passwordError} variant='error' />
        </div>
      </div>

      <div className='flex flex-col gap-[1.2rem]'>
        <Message id={`${fieldIdPrefix}-login-error`} message={loginError} variant='error' />
        <Button type='submit' color='blue' isLoading={formState.isSubmitting || isNavigating}>
          로그인
        </Button>
        <p className='caption-12-md text-center text-gray-400'>
          {'아직 계정이 없나요? '}
          <Link href={ROUTES.SIGNUP} className='text-blue underline'>
            회원가입
          </Link>
        </p>
      </div>
    </form>
  );
}
