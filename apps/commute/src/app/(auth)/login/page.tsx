import type { Metadata } from 'next';
import Image from 'next/image';
import LoginForm from './_components/LoginForm';

export const metadata: Metadata = {
  title: '로그인 | Commute',
};

export default function LoginPage() {
  return (
    <div className='flex flex-col gap-[3.2rem]'>
      <header className='flex flex-col items-center gap-[1.2rem] text-center'>
        {/* 로고는 사진이 들어간 그림이라 아이콘이 아닌 이미지로 둔다 */}
        <Image src='/logo-ku.svg' alt='건국대학교' width={90} height={47} priority />
        <h1 className='title-24-md text-black'>건국대학교 출근부</h1>
        <p className='caption-14-md text-gray-400'>학교 메일로 로그인해 주세요</p>
      </header>
      <LoginForm />
    </div>
  );
}
