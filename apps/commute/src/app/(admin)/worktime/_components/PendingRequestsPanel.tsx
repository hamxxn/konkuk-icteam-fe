'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IconArrowRight } from '@konkuk-icteam-fe/design-system/assets';
import { ROUTES } from '@/shared/config/routes';
import { getWorkChangeRequests } from '../../_apis/workChangeRequests';
import { getCurrentMonthKey, parseMonthKey } from '../../_utils/monthKey';
import { formatMonthDayTime } from '@/shared/utils/formatDate';

// 패널에 미리 보여 줄 요청 수. 나머지는 더보기로 수정요청 화면에서 본다
const PREVIEW_COUNT = 3;

// 이번 달 승인 대기 중인 근무 변경 요청을 최근 것부터 3개까지 미리 보여 준다. 더보기를 누르면 수정요청 화면으로 간다
export default function PendingRequestsPanel() {
  const [currentMonth] = useState(() => parseMonthKey(getCurrentMonthKey()));
  const pendingRequests = getWorkChangeRequests(currentMonth).requests.filter(
    ({ statusCode }) => statusCode === 'CS01',
  );

  return (
    <aside className='bg-black-1 flex flex-col gap-[1.2rem] rounded-[1.6rem] border border-gray-50 p-[2.4rem] shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]'>
      <div className='flex items-center justify-between'>
        <h2 className='font-18-md text-black'>승인 대기</h2>
        <Link
          href={ROUTES.ADMIN_WORKTIME_CHANGE_REQUESTS}
          className='caption-14-md flex items-center gap-[0.2rem] text-gray-500 hover:text-black'
        >
          <IconArrowRight aria-hidden className='h-[1.6rem] w-[1.6rem]' />
        </Link>
      </div>

      {pendingRequests.length === 0 ? (
        <p className='caption-14-rg py-[1.2rem] text-gray-400'>승인 대기 중인 요청이 없어요.</p>
      ) : (
        <ul className='flex flex-col gap-[0.8rem]'>
          {pendingRequests.slice(0, PREVIEW_COUNT).map((request) => (
            <li key={request.requestId}>
              <Link
                href={ROUTES.ADMIN_WORKTIME_CHANGE_REQUESTS}
                className='flex flex-col gap-[0.4rem] rounded-[1.2rem] bg-gray-50/60 px-[1.4rem] py-[1.2rem]'
              >
                <span className='flex items-center justify-between gap-[0.8rem]'>
                  <span className='font-14-bd text-black'>{request.userName}</span>
                  <span className='caption-12-md text-gray-400'>
                    {formatMonthDayTime(request.requestedAt)}
                  </span>
                </span>
                <span className='caption-12-md flex gap-[0.6rem]'>
                  {request.deleteSchedules.length > 0 && (
                    <span className='text-red'>{`삭제 ${request.deleteSchedules.length}`}</span>
                  )}
                  {request.addSchedules.length > 0 && (
                    <span className='text-blue'>{`추가 ${request.addSchedules.length}`}</span>
                  )}
                </span>
                <span className='caption-12-rg truncate text-gray-700'>{request.reason}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
