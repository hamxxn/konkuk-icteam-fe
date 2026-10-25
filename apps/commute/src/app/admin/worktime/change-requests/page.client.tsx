'use client';

import { useState } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { ArrowButton } from '@/shared/ui';
import type { WorkChangeRequest } from '../../_apis/workChangeRequests';
import { getCurrentMonthKey, parseMonthKey, shiftMonthKey } from '../../_lib/monthKey';
import RejectModal from './(.)reject-modal/RejectModal';
import StatusFilterTabs from './_components/StatusFilterTabs';
import type { StatusFilter } from './_lib/statusFilter';
import WorkChangeRequestCard from './_components/WorkChangeRequestCard';
import { useWorkChangeRequests } from './_hooks/useWorkChangeRequests';

// 다음 달 요청까지 볼 수 있다 (근무 신청은 다음 달 것까지 받는다)
const MAX_MONTH_OFFSET = 1;

// 근로시간 수정요청. 달마다 요청을 상태별로 보고 승인·반려한다
type PageClientProps = {
  statusFilter: StatusFilter;
};

export default function PageClient({ statusFilter }: PageClientProps) {
  const [currentMonthKey] = useState(getCurrentMonthKey);
  const [monthKey, setMonthKey] = useState(currentMonthKey);
  const [rejectTarget, setRejectTarget] = useState<WorkChangeRequest | null>(null);
  const { showToast, toast } = useToast();

  const { year, month } = parseMonthKey(monthKey);
  const maxMonthKey = shiftMonthKey(currentMonthKey, MAX_MONTH_OFFSET);
  const { summary, requests, handleApprove, handleReject } = useWorkChangeRequests(year, month);
  const visibleRequests = requests.filter(
    ({ statusCode }) => statusFilter === 'ALL' || statusCode === statusFilter,
  );

  const handleApproveClick = ({ requestId, userName }: WorkChangeRequest) => {
    handleApprove(requestId);
    showToast(`${userName}님의 요청을 승인했어요.`);
  };

  const handleRejectSubmit = (reason: string) => {
    if (!rejectTarget) return;
    handleReject(rejectTarget.requestId, reason);
    showToast(`${rejectTarget.userName}님의 요청을 반려했어요.`);
    setRejectTarget(null);
  };

  return (
    <div className='mx-auto flex w-full max-w-[140rem] flex-col gap-[3.2rem] p-[3.4rem]'>
      <div className='flex items-center justify-center gap-[2rem]'>
        <ArrowButton
          direction='left'
          size='medium'
          aria-label='이전 달'
          onClick={() => setMonthKey((prev) => shiftMonthKey(prev, -1))}
        />
        <h1 className='title-26-eb min-w-[24rem] text-center text-black'>
          {`${year}년 ${month}월 수정요청`}
        </h1>
        <ArrowButton
          direction='right'
          size='medium'
          aria-label='다음 달'
          disabled={monthKey >= maxMonthKey}
          onClick={() => setMonthKey((prev) => shiftMonthKey(prev, 1))}
        />
      </div>

      <StatusFilterTabs summary={summary} selected={statusFilter} />

      {visibleRequests.length === 0 ? (
        <p className='bg-black-1 font-16-rg rounded-[1.2rem] border border-gray-50 py-[6rem] text-center text-gray-500'>
          해당하는 요청이 없습니다.
        </p>
      ) : (
        <div className='grid grid-cols-3 gap-[1.6rem]'>
          {visibleRequests.map((request) => (
            <WorkChangeRequestCard
              key={request.requestId}
              request={request}
              onApprove={() => handleApproveClick(request)}
              onReject={() => setRejectTarget(request)}
            />
          ))}
        </div>
      )}

      <RejectModal
        requesterName={rejectTarget?.userName ?? null}
        onClose={() => setRejectTarget(null)}
        onSubmit={handleRejectSubmit}
      />
      {toast}
    </div>
  );
}
