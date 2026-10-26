/**
 * 'HH:MM' 형식의 시각을 자정부터 지난 분으로 바꿉니다.
 * @param time 'HH:MM' 형식의 시각
 * @returns 자정부터 지난 분
 * @example const minutes = convertTimeToMinutes('09:30'); // 570
 */
export const convertTimeToMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);

  return hours * 60 + minutes;
};

/**
 * 시각이 시간 범위들 중 하나에 들어가는지 확인합니다. 시작은 포함하고 끝은 포함하지 않습니다.
 * @param ranges 'HH:MM' 형식의 시작·끝 시각 범위 목록
 * @param time 확인할 'HH:MM' 형식의 시각
 * @returns 범위 안에 있으면 true
 * @example const isLunch = hasTimeInRanges([{ start: '11:30', end: '13:00' }], '12:00'); // true
 */
export const hasTimeInRanges = (ranges: { start: string; end: string }[], time: string) => {
  const targetMinutes = convertTimeToMinutes(time);

  return ranges.some(
    ({ start, end }) =>
      targetMinutes >= convertTimeToMinutes(start) && targetMinutes < convertTimeToMinutes(end),
  );
};

const DAYS_PER_WEEK = 7;
const WORKDAYS_PER_WEEK = 5;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * 날짜를 'YYYY-MM-DD' 형식으로 바꿉니다. 로컬 시간 기준이라 시차로 날짜가 밀리지 않습니다.
 * @param date 바꿀 날짜
 * @returns 'YYYY-MM-DD' 형식의 문자열
 * @example const key = formatDateKey(new Date(2026, 9, 19)); // '2026-10-19'
 */
export const formatDateKey = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

/**
 * 날짜를 'MM.DD' 형식으로 바꿉니다.
 * @param date 바꿀 날짜
 * @returns 'MM.DD' 형식의 문자열
 * @example const label = formatMonthDay(new Date(2026, 9, 19)); // '10.19'
 */
export const formatMonthDay = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}.${day}`;
};

/**
 * 'YYYY-MM-DD' 형식의 날짜 문자열을 'MM.DD' 형식으로 바꿉니다. Date가 있으면 formatMonthDay를 씁니다.
 * @param dateKey 'YYYY-MM-DD' 형식의 날짜
 * @returns 'MM.DD' 형식의 문자열
 * @example const label = formatDateKeyToMonthDay('2026-10-30'); // '10.30'
 */
export const formatDateKeyToMonthDay = (dateKey: string) => dateKey.slice(5).replace('-', '.');

/**
 * 날짜가 속한 주의 월요일을 구합니다.
 * @param date 기준 날짜
 * @returns 그 주 월요일 0시
 * @example const monday = getMondayOfWeek(new Date(2026, 9, 23)); // 2026-10-19
 */
export const getMondayOfWeek = (date: Date) => {
  const daysFromMonday = (date.getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;

  return addDays(date, -daysFromMonday);
};

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
 * 그 달 1주차의 월요일을 구합니다. 주는 목요일이 속한 달의 주차로 셉니다(ISO 주차 방식).
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

/**
 * 오늘이 근로 신청 기간(시작일~마감일, 양 끝 포함) 안인지 확인합니다. 기간이 없으면 관리자가 아직 열지 않은 것으로 봅니다.
 * @param period 신청 기간
 * @param period.applyStartDate 신청 시작일 'YYYY-MM-DD' (없으면 null)
 * @param period.applyEndDate 신청 마감일 'YYYY-MM-DD' (없으면 null)
 * @param todayKey 오늘 'YYYY-MM-DD'
 * @returns 신청 기간 안이면 true
 * @example const isOpen = hasOpenApplyPeriod({ applyStartDate: '2026-10-20', applyEndDate: '2026-10-30' }, '2026-10-23'); // true
 */
export const hasOpenApplyPeriod = (
  { applyStartDate, applyEndDate }: { applyStartDate: string | null; applyEndDate: string | null },
  todayKey: string,
) =>
  applyStartDate !== null &&
  applyEndDate !== null &&
  todayKey >= applyStartDate &&
  todayKey <= applyEndDate;
