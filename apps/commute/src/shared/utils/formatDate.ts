import { formatNumber, parseISO } from '@konkuk-icteam-fe/design-system/date';

// 화면에 보이는 날짜 모양. 날짜는 MM.DD, 기간은 MM.DD - MM.DD로 통일한다

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

// Date 또는 YYYY-MM-DD 글자
type DateInput = Date | string;

const toDate = (date: DateInput) => (typeof date === 'string' ? parseISO(date) : date);

/**
 * 날짜를 MM.DD로 바꿉니다.
 * @param date 날짜 (Date 또는 YYYY-MM-DD)
 * @returns MM.DD
 * @example formatMonthDay('2026-10-05'); // '10.05'
 */
export const formatMonthDay = (date: DateInput) => {
  const value = toDate(date);

  return `${formatNumber(value.getMonth() + 1)}.${formatNumber(value.getDate())}`;
};

/**
 * 기간을 MM.DD - MM.DD로 바꿉니다.
 * @param startDate 시작일 (Date 또는 YYYY-MM-DD)
 * @param endDate 마감일 (Date 또는 YYYY-MM-DD)
 * @returns MM.DD - MM.DD
 * @example formatDateRange('2026-10-20', '2026-10-25'); // '10.20 - 10.25'
 */
export const formatDateRange = (startDate: DateInput, endDate: DateInput) =>
  `${formatMonthDay(startDate)} - ${formatMonthDay(endDate)}`;

/**
 * 날짜를 요일과 함께 MM.DD (요일)로 바꿉니다.
 * @param date 날짜 (Date 또는 YYYY-MM-DD)
 * @returns MM.DD (요일)
 * @example formatMonthDayWithWeekday('2026-10-24'); // '10.24 (토)'
 */
export const formatMonthDayWithWeekday = (date: DateInput) =>
  `${formatMonthDay(date)} (${WEEKDAY_LABELS[toDate(date).getDay()]})`;

/**
 * 날짜·시각을 MM.DD HH:mm으로 바꿉니다.
 * @param date 날짜·시각
 * @returns MM.DD HH:mm
 * @example formatMonthDayTime(new Date(2026, 9, 22, 10, 12)); // '10.22 10:12'
 */
export const formatMonthDayTime = (date: Date) =>
  `${formatMonthDay(date)} ${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}`;

/**
 * 날짜의 연·월을 YYYY.MM으로 바꿉니다. 근로 시작 달처럼 날짜가 아니라 달을 보여 줄 때 씁니다.
 * @param date 날짜 (Date 또는 YYYY-MM-DD)
 * @returns YYYY.MM
 * @example formatYearMonth(new Date(2025, 2, 1)); // '2025.03'
 */
export const formatYearMonth = (date: DateInput) => {
  const value = toDate(date);

  return `${value.getFullYear()}.${formatNumber(value.getMonth() + 1)}`;
};
