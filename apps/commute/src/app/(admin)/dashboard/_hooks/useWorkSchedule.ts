import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { getAttendances } from '../../_apis/attendances';
import { getWorkSchedules } from '../../_apis/workSchedules';

// 고른 날의 근무 시간표와 근무 구간마다 출근 기록
export const useWorkSchedule = (dateKey: string) => {
  const date = parseISO(dateKey);
  const slots = getWorkSchedules({ startDate: date, endDate: date }).days[0]?.slots ?? [];
  const { shifts } = getAttendances({ date });

  return { slots, shifts };
};
