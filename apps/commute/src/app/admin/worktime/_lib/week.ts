import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { formatDateRange, formatMonthDay } from '@/shared/utils/formatDate';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const WORKDAY_COUNT = 5;

export type WeekDay = {
  dateKey: string;
  // M.D
  dateLabel: string;
  weekday: string;
};

/**
 * 날짜가 속한 주의 월요일을 얻습니다. 일요일은 다음 주가 아니라 지난 월요일 주에 넣습니다.
 * @param date 날짜
 * @returns 그 주 월요일 (YYYY-MM-DD)
 * @example getWeekStartKey(new Date(2026, 9, 24)); // '2026-10-19'
 */
export const getWeekStartKey = (date: Date) => {
  const monday = new Date(date);
  const offset = (date.getDay() + 6) % 7;
  monday.setDate(date.getDate() - offset);

  return toISO(monday);
};

/**
 * 주를 앞뒤로 옮깁니다.
 * @param weekStartKey 옮길 주의 월요일 (YYYY-MM-DD)
 * @param delta 옮길 주 수 (음수면 이전 주)
 * @returns 옮긴 주의 월요일 (YYYY-MM-DD)
 * @example shiftWeek('2026-10-19', 1); // '2026-10-26'
 */
export const shiftWeek = (weekStartKey: string, delta: number) => {
  const date = parseISO(weekStartKey);
  date.setDate(date.getDate() + delta * 7);

  return toISO(date);
};

/**
 * 주의 평일(월~금) 목록을 만듭니다.
 * @param weekStartKey 주의 월요일 (YYYY-MM-DD)
 * @returns 월~금 날짜와 표시용 글자
 * @example getWeekDays('2026-10-19')[0]; // { dateKey: '2026-10-19', dateLabel: '10.19', weekday: '월' }
 */
export const getWeekDays = (weekStartKey: string): WeekDay[] =>
  Array.from({ length: WORKDAY_COUNT }, (_, index) => {
    const date = parseISO(weekStartKey);
    date.setDate(date.getDate() + index);

    return {
      dateKey: toISO(date),
      dateLabel: formatMonthDay(date),
      weekday: WEEKDAY_LABELS[date.getDay()] ?? '',
    };
  });

/**
 * 주를 "MM.DD - MM.DD"로 보여 줍니다.
 * @param weekStartKey 주의 월요일 (YYYY-MM-DD)
 * @returns 월요일부터 금요일까지의 글자
 * @example formatWeekRange('2026-10-19'); // '10.19 - 10.23'
 */
export const formatWeekRange = (weekStartKey: string) => {
  const days = getWeekDays(weekStartKey);

  return formatDateRange(
    days[0]?.dateKey ?? weekStartKey,
    days[days.length - 1]?.dateKey ?? weekStartKey,
  );
};
