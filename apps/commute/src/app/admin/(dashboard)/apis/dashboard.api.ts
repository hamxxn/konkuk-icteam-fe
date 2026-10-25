import { useState } from 'react';
import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { getWorkChangeRequests } from '../../_apis/workChangeRequests';
import { getWorkSchedules } from '../../_apis/workSchedules';

// 처리를 기다리는 근로시간 승인 요청 수. 이번 달 기준이다
export const usePendingRequestCount = () => {
  const [today] = useState(() => new Date());

  return getWorkChangeRequests({ year: today.getFullYear(), month: today.getMonth() + 1 }).summary
    .pendingCount;
};

// 고른 날의 근무 시간표
export const useWorkSchedule = (dateKey: string) => {
  const date = parseISO(dateKey);
  const slots = getWorkSchedules({ startDate: date, endDate: date }).days[0]?.slots ?? [];

  return { slots };
};
