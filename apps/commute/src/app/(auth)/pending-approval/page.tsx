import type { Metadata } from 'next';
import { IconInfo } from '@konkuk-icteam-fe/design-system/assets';
import BackToLoginButton from './_components/BackToLoginButton';

export const metadata: Metadata = {
  title: '승인 대기 | Commute',
};

// 가입 승인을 기다리는 계정이 로그인하면 오는 화면. 관리자가 승인하면 다시 로그인하면 된다
export default function PendingApprovalPage() {
  return (
    <div className='flex flex-col gap-[3.2rem]'>
      <header className='flex flex-col items-center gap-[1.6rem] text-center'>
        <div
          aria-hidden='true'
          className='bg-blue text-black-1 flex h-[4.8rem] w-[4.8rem] items-center justify-center rounded-full'
        >
          <IconInfo className='h-[2.4rem] w-[2.4rem]' />
        </div>
        <div className='flex flex-col gap-[0.8rem]'>
          <h1 className='title-20-bd text-black'>가입 승인을 기다리고 있어요</h1>
          <p className='caption-14-md whitespace-pre-line text-gray-400'>
            {'관리자가 가입을 승인하면 로그인할 수 있어요.\n승인된 뒤에 다시 로그인해 주세요.'}
          </p>
        </div>
      </header>
      <BackToLoginButton />
    </div>
  );
}
