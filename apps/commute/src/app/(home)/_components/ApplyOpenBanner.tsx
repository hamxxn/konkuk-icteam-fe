'use client';

import Link from 'next/link';

import { IconArrowRight, IconWorktime } from '@konkuk-icteam-fe/design-system/assets';

import { formatDateKeyToMonthDay } from '@/shared/components/timetable/utils';
import { useApplyPeriod } from '@/shared/hooks/useApplyPeriod';
import { ROUTES } from '@/shared/config/routes';

// 다음 달 근로 신청 기간일 때만 홈에 뜨는 신청 바로가기.

export default function ApplyOpenBanner() {
  const { month, isApplyOpen, applyEndDate } = useApplyPeriod();

  if (!isApplyOpen) return null;

  return (
    <Link
      href={ROUTES.TIMETABLE_APPLY}
      className='flex items-center gap-[1.2rem] rounded-[0.6rem] border border-gray-50 px-[2rem] py-[1.6rem] transition-colors hover:bg-gray-50'
    >
      <span
        aria-hidden
        className='bg-blue/15 text-blue flex h-[4rem] w-[4rem] shrink-0 items-center justify-center rounded-full'
      >
        <IconWorktime className='h-[2rem] w-[2rem]' />
      </span>
      <div className='flex min-w-0 flex-1 flex-col gap-[0.2rem]'>
        <p className='font-16-bd text-black'>{`${month}월 근로 신청하기`}</p>
        {applyEndDate && (
          <p className='caption-12-md text-gray-400'>
            <span className='text-blue'>{`${formatDateKeyToMonthDay(applyEndDate)}까지`}</span>{' '}
            신청하고 바꿀 수 있어요
          </p>
        )}
      </div>
      <IconArrowRight aria-hidden className='text-blue h-[2.4rem] w-[2.4rem] shrink-0' />
    </Link>
  );
}
