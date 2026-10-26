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
 * 칸 하나를 가리키는 key를 만듭니다.
 * @param dateKey 날짜 'YYYY-MM-DD'
 * @param startTime 칸 시작 시각 'HH:MM'
 * @returns 'YYYY-MM-DD HH:MM'
 * @example const key = createSlotKey('2026-10-27', '09:00'); // '2026-10-27 09:00'
 */
export const createSlotKey = (dateKey: string, startTime: string) => `${dateKey} ${startTime}`;

/**
 * 한 시간 칸들을 날짜별로 이어진 구간으로 묶습니다. 요청·신청을 보낼 때 씁니다.
 * @param slots 칸 목록
 * @param slots[].date 날짜 'YYYY-MM-DD'
 * @param slots[].startTime 칸 시작 시각 'HH:MM'
 * @param slotMinutes 칸 하나의 길이 (분)
 * @returns 날짜·시작 시각 순으로 정렬한 구간 목록 (date는 'YYYY-MM-DD', start·end는 'HH:MM')
 * @example const ranges = mergeSlotsToRanges([{ date: '2026-10-27', startTime: '09:00' }, { date: '2026-10-27', startTime: '10:00' }], 60); // [{ date: '2026-10-27', start: '09:00', end: '11:00' }]
 */
export const mergeSlotsToRanges = (
  slots: { date: string; startTime: string }[],
  slotMinutes: number,
) => {
  const toTime = (minutes: number) =>
    `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  const sortedSlots = [...slots].sort((a, b) =>
    createSlotKey(a.date, a.startTime).localeCompare(createSlotKey(b.date, b.startTime)),
  );

  return sortedSlots.reduce<{ date: string; start: string; end: string }[]>((ranges, slot) => {
    const startMinutes = convertTimeToMinutes(slot.startTime);
    const lastRange = ranges.at(-1);
    const isContinued =
      lastRange?.date === slot.date && convertTimeToMinutes(lastRange.end) === startMinutes;

    return isContinued
      ? [...ranges.slice(0, -1), { ...lastRange, end: toTime(startMinutes + slotMinutes) }]
      : [
          ...ranges,
          { date: slot.date, start: slot.startTime, end: toTime(startMinutes + slotMinutes) },
        ];
  }, []);
};
