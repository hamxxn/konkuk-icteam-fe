import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { checkHoliday, checkWeekend, getMonthDates } from '@/shared/utils/calendar';
import { parseMonthKey } from '../../_utils/monthKey';

/**
 * 한 달 중 원래 근무가 없는 날(주말·공휴일)을 얻습니다.
 * @param monthKey 달 (YYYY-MM)
 * @returns 그 달의 주말·공휴일 (YYYY-MM-DD, 날짜순)
 * @example getNonWorkingDates('2026-10').slice(0, 3); // ['2026-10-03', '2026-10-04', '2026-10-05']
 */
export const getNonWorkingDates = (monthKey: string) => {
  const { year, month } = parseMonthKey(monthKey);

  return getMonthDates(new Date(year, month - 1, 1)).filter(
    (dateKey) => checkWeekend(parseISO(dateKey)) || checkHoliday(dateKey),
  );
};
