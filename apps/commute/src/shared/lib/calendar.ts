import { daysInMonth, parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';

/**
 * 날짜가 평일(월~금)인지 확인합니다.
 * @param dateValue 날짜 (YYYY-MM-DD)
 * @returns 평일이면 true
 * @example checkWeekday('2026-10-24'); // false (토요일)
 */
export const checkWeekday = (dateValue: string) => {
  const day = parseISO(dateValue).getDay();

  return day !== 0 && day !== 6;
};

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
