import { useState } from 'react';
import { getWorkChangeRequests } from '../../_apis/workChangeRequests';
import { getCurrentMonthKey, parseMonthKey } from '../../_utils/monthKey';

// 처리를 기다리는 근로시간 승인 요청 수. 이번 달 기준이다
export const usePendingRequestCount = () => {
  const [currentMonth] = useState(() => parseMonthKey(getCurrentMonthKey()));

  return getWorkChangeRequests(currentMonth).summary.pendingCount;
};
