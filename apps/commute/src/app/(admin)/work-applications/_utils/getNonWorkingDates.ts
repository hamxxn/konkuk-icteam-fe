import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { PUBLIC_HOLIDAYS } from '@/shared/config/holidays';
import { parseMonthKey } from '../../_utils/monthKey';

/**
 * 한 달 중 원래 근무가 없는 날(주말·공휴일)을 얻습니다.
 * @param monthKey 달 (YYYY-MM)
 * @returns 그 달의 주말·공휴일 (YYYY-MM-DD, 날짜순)
 * @example getNonWorkingDates('2026-10').slice(0, 3); // ['2026-10-03', '2026-10-04', '2026-10-05']
 */
export const getNonWorkingDates = (monthKey: string) => {
  const { year, month } = parseMonthKey(monthKey);
  const dayCount = new Date(year, month, 0).getDate();

  return Array.from({ length: dayCount }, (_, index) => new Date(year, month - 1, index + 1))
    .filter((date) => {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      return isWeekend || PUBLIC_HOLIDAYS.some((holiday) => holiday === toISO(date));
    })
    .map(toISO);
};
