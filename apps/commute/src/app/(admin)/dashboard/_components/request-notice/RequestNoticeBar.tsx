'use client';

import Link from 'next/link';
import { IconArrowRight, IconInfo } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { ROUTES } from '@/shared/config/routes';
import { usePendingRequestCount } from '../../_hooks/usePendingRequestCount';

// 대시보드 맨 위 알림 줄. 승인 대기 요청 수는 직접 불러온다. 누르면 근로시간 수정요청 화면으로 간다. 처리할 요청이 있으면 파랗게 눈에 띄게 한다
export default function RequestNoticeBar() {
  const count = usePendingRequestCount();
  const hasRequests = count > 0;

  return (
    <Link
      // 처리할 요청이 있으면 승인 대기 탭을 바로 연다
      href={
        hasRequests
          ? `${ROUTES.ADMIN_WORKTIME_CHANGE_REQUESTS}?status=CS01`
          : ROUTES.ADMIN_WORKTIME_CHANGE_REQUESTS
      }
      className={cn(
        'group flex items-center gap-[1.2rem] rounded-[1.2rem] px-[2rem] py-[1.4rem] transition-colors',
        hasRequests ? 'bg-blue/10 hover:bg-blue/15' : 'bg-gray-50 hover:bg-gray-50/70',
      )}
    >
      <span
        className={cn(
          'flex h-[3.2rem] w-[3.2rem] shrink-0 items-center justify-center rounded-full',
          hasRequests ? 'bg-blue text-black-1' : 'bg-black-1 text-gray-400',
        )}
      >
        <IconInfo aria-hidden className='h-[1.6rem] w-[1.6rem]' />
      </span>
      <p className='font-16-md flex-1 text-black'>
        {hasRequests ? (
          <>
            처리할 근로시간 승인 요청이{' '}
            <strong className='font-16-bd text-blue'>{`${count}건`}</strong> 있어요.
          </>
        ) : (
          <span className='text-gray-500'>처리할 근로시간 승인 요청이 없어요.</span>
        )}
      </p>
      <span
        className={cn(
          'caption-14-md flex items-center gap-[0.2rem]',
          hasRequests ? 'text-blue' : 'text-gray-500',
        )}
      >
        {hasRequests ? '바로 처리하기' : '요청 내역 보기'}
        <IconArrowRight
          aria-hidden
          className='h-[1.8rem] w-[1.8rem] transition-transform group-hover:translate-x-[0.2rem]'
        />
      </span>
    </Link>
  );
}
