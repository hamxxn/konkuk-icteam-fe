import { daysInMonth, toISO } from '@konkuk-icteam-fe/design-system/date';
import { PUBLIC_HOLIDAYS } from '@/shared/config/holidays';

const SUNDAY = 0;
const SATURDAY = 6;
const PUBLIC_HOLIDAY_SET = new Set<string>(PUBLIC_HOLIDAYS);

/**
 * 날짜가 주말(토·일)인지 확인합니다.
 * @param date 날짜
 * @returns 주말이면 true
 * @example checkWeekend(new Date(2026, 9, 24)); // true (토요일)
 */
export const checkWeekend = (date: Date) => date.getDay() === SUNDAY || date.getDay() === SATURDAY;

/**
 * 날짜가 공휴일(대체공휴일 포함)인지 확인합니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @returns 공휴일이면 true
 * @example checkHoliday('2026-10-09'); // true (한글날)
 */
export const checkHoliday = (dateKey: string) => PUBLIC_HOLIDAY_SET.has(dateKey);

/**
 * 한 달의 모든 날짜 문자열 목록을 만듭니다.
 * @param month 그 달에 속한 아무 날짜
 * @returns 1일부터 말일까지의 날짜 목록 (YYYY-MM-DD)
 * @example getMonthDates(new Date(2026, 1, 10)); // ['2026-02-01', ..., '2026-02-28']
 */
export const getMonthDates = (month: Date) =>
  Array.from({ length: daysInMonth(month) }, (_, index) =>
    toISO(new Date(month.getFullYear(), month.getMonth(), index + 1)),
  );
