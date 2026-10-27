import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { getWorkSchedules } from '../../_apis/workSchedules';

// 고른 날의 근무 시간표
export const useWorkSchedule = (dateKey: string) => {
  const date = parseISO(dateKey);
  const slots = getWorkSchedules({ startDate: date, endDate: date }).days[0]?.slots ?? [];

  return { slots };
};
