import Link from 'next/link';
import { useId } from 'react';
import { IconArrowRight } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';

type AdminPanelProps = {
  title: string;
  // 제목 옆 화살표로 가는 자세히 보기 화면. 없으면 화살표를 그리지 않는다
  href?: string;
  children: React.ReactNode;
  className?: string;
};

// 관리자 화면들이 함께 쓰는 회색 카드. 제목 줄 오른쪽 화살표로 해당 관리 화면에 간다
export default function AdminPanel({ title, href, children, className }: AdminPanelProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn('rounded-[1.2rem] border border-gray-50', className)}
    >
      <div className='flex items-center justify-between px-[2.1rem] pt-[2.4rem] pb-[2.1rem]'>
        <div className='flex items-center gap-[0.8rem]'>
          <h2 id={headingId} className='font-16-bd text-black'>
            {title}
          </h2>
        </div>
        {href ? (
          <Link
            href={href}
            aria-label={`${title} 자세히 보기`}
            className='flex h-[2.4rem] w-[2.4rem] items-center justify-center text-gray-500 hover:text-black'
          >
            <IconArrowRight aria-hidden className='h-[2rem] w-[2rem]' />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
