// 주 단위 날짜 계산. 주는 월요일에 시작하고, 두 달에 걸친 주는 목요일이 속한 달로 센다 (ISO 주차 방식)

export const DAYS_PER_WEEK = 7;
const WORKDAYS_PER_WEEK = 5;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const THURSDAY = 4;
const DAYS_FROM_MONDAY_TO_THURSDAY = 3;

/**
 * 날짜에서 며칠 뒤(음수면 며칠 전)의 날짜를 구합니다.
 * @param date 기준 날짜
 * @param days 더할 일 수
 * @returns 새 날짜 0시
 * @example const nextMonday = addDays(new Date(2026, 9, 19), 7); // 2026-10-26
 */
export const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/**
 * 날짜가 속한 주의 월요일을 구합니다. 일요일은 지난 월요일 주에 넣습니다.
 * @param date 기준 날짜
 * @returns 그 주 월요일 0시
 * @example const monday = getMondayOfWeek(new Date(2026, 9, 23)); // 2026-10-19
 */
export const getMondayOfWeek = (date: Date) => {
  const daysFromMonday = (date.getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;

  return addDays(date, -daysFromMonday);
};

/**
 * 그 달 1주차의 월요일을 구합니다. 주는 목요일이 속한 달의 주차로 셉니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 1주차 월요일 0시
 * @example const monday = getFirstWeekMonday(2026, 10); // 2026-09-28 (10/1이 목요일)
 */
export const getFirstWeekMonday = (year: number, month: number) => {
  const firstDate = new Date(year, month - 1, 1);
  const daysUntilThursday = (THURSDAY - firstDate.getDay() + DAYS_PER_WEEK) % DAYS_PER_WEEK;

  return addDays(firstDate, daysUntilThursday - DAYS_FROM_MONDAY_TO_THURSDAY);
};

/**
 * 날짜가 속한 주가 몇 년 몇 월 몇 주차인지 구합니다. 두 달에 걸친 주는 목요일이 속한 달로 셉니다.
 * @param date 기준 날짜
 * @returns year, month(1~12), week(1부터)
 * @example const info = getMonthWeekInfo(new Date(2026, 9, 23)); // { year: 2026, month: 10, week: 4 }
 * @example const info = getMonthWeekInfo(new Date(2026, 8, 30)); // { year: 2026, month: 10, week: 1 }
 */
export const getMonthWeekInfo = (date: Date) => {
  const monday = getMondayOfWeek(date);
  const thursday = addDays(monday, DAYS_FROM_MONDAY_TO_THURSDAY);
  const year = thursday.getFullYear();
  const month = thursday.getMonth() + 1;
  const firstMonday = getFirstWeekMonday(year, month);
  const daysFromFirstMonday = Math.round(
    (monday.getTime() - firstMonday.getTime()) / MILLISECONDS_PER_DAY,
  );

  return { year, month, week: daysFromFirstMonday / DAYS_PER_WEEK + 1 };
};

/**
 * 월요일부터 금요일까지의 날짜를 구합니다.
 * @param monday 그 주 월요일
 * @returns 월요일부터 금요일까지 5개의 날짜
 * @example const dates = getWeekdayDates(new Date(2026, 9, 19)); // 10.19 ~ 10.23
 */
export const getWeekdayDates = (monday: Date) =>
  Array.from({ length: WORKDAYS_PER_WEEK }, (_, index) => addDays(monday, index));
