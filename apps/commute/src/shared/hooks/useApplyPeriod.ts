import { useState } from 'react';
import { getWorkApplicationSettings } from '@/shared/apis/workApplications';

// 다음 달 근로 신청 기간. 관리자가 신청을 열고 나를 명단에 넣으면, 그 기간 안에서 신청하고 마감 전까지 바꿀 수 있다
export const useApplyPeriod = () => {
  const [now] = useState(() => new Date());
  const nextMonthFirstDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const year = nextMonthFirstDate.getFullYear();
  const month = nextMonthFirstDate.getMonth() + 1;
  const { settings, canApply } = getWorkApplicationSettings({ year, month });
  const isApplyOpen =
    canApply && settings !== null && settings.applyStartDate <= now && now <= settings.applyEndDate;

  return { year, month, isApplyOpen, settings };
};
