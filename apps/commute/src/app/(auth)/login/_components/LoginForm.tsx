'use client';

import { useId, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ComboBox, Message } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import { USER_ROLE, type UserRole } from '@/shared/constants/userRole';
import { login } from '../../_apis/auth';
import { loginSchema, type LoginFormValues } from '../_lib/loginSchema';
import { getSchoolEmailSuggestions } from '../_utils/schoolEmail';
import PasswordInput from './PasswordInput';

// 로그인에 실패했을 때 폼 아래에 보여 줄 글자. 메일이 없는지 비밀번호가 틀렸는지는 알려 주지 않는다
const INVALID_CREDENTIALS_MESSAGE = '이메일 또는 비밀번호가 틀렸습니다.';

// 로그인한 뒤 역할에 따라 처음 보여 줄 화면
const HOME_ROUTE_BY_ROLE: Record<UserRole, string> = {
  [USER_ROLE.STUDENT]: ROUTES.HOME,
  [USER_ROLE.ADMIN]: ROUTES.ADMIN_HOME,
};

// 로그인 폼. 학교 메일과 비밀번호를 받고, 성공하면 역할에 맞는 홈으로, 승인 대기 계정이면 승인 대기 화면으로 보낸다
export default function LoginForm() {
  const router = useRouter();
  // 로그인 뒤 다음 화면으로 넘어가는 동안. 이때도 버튼을 로딩으로 두어 다시 누르지 못하게 한다
  const [isNavigating, startNavigation] = useTransition();
  const { control, formState, handleSubmit, register, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  // 메일 칸은 ComboBox라 register 대신 useController로 잇는다. 비밀번호(register)보다 먼저 불러야
  // 폼 순서대로 등록돼, 둘 다 틀렸을 때 메일 칸에 먼저 초점이 간다
  const { field: emailField } = useController({ control, name: 'email' });
  const fieldIdPrefix = useId();
  const emailError = formState.errors.email?.message;
  const passwordError = formState.errors.password?.message;
  const loginError = formState.errors.root?.message;

  const handleValidSubmit = (values: LoginFormValues) => {
    const result = login(values);
    if (result.isSuccess) {
      startNavigation(() => router.push(HOME_ROUTE_BY_ROLE[result.user.role]));
      return;
    }
    if (result.errorCode === 'PENDING_APPROVAL') {
      startNavigation(() => router.push(ROUTES.PENDING_APPROVAL));
      return;
    }

    setError('root', { message: INVALID_CREDENTIALS_MESSAGE });
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
          {/* 아이디만 입력해도 @konkuk.ac.kr을 붙인 메일을 후보로 띄운다 */}
          <ComboBox
            options={getSchoolEmailSuggestions(emailField.value)}
            value={emailField.value}
            onChange={emailField.onChange}
            onBlur={emailField.onBlur}
            placeholder='아이디@konkuk.ac.kr'
            showEmptyMessage={false}
            inputProps={{
              id: `${fieldIdPrefix}-email`,
              name: emailField.name,
              ref: emailField.ref,
              type: 'email',
              inputMode: 'email',
              autoComplete: 'username',
              hasBorder: true,
              hasError: emailError !== undefined,
              'aria-invalid': emailError !== undefined,
              'aria-describedby': `${fieldIdPrefix}-email-error`,
            }}
          />
          <Message id={`${fieldIdPrefix}-email-error`} message={emailError} variant='error' />
        </div>

        <div className='flex flex-col gap-[0.8rem]'>
          <label htmlFor={`${fieldIdPrefix}-password`} className='font-14-bd text-black'>
            비밀번호
          </label>
          {/* 메일 칸(ComboBox)이 높이를 4.2rem으로 두므로 두 칸 높이를 맞춘다 */}
          <PasswordInput
            id={`${fieldIdPrefix}-password`}
            className='h-[4.2rem]'
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
