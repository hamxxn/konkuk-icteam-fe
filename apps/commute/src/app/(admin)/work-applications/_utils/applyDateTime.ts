import { formatNumber, parseISO } from '@konkuk-icteam-fe/design-system/date';

/**
 * 날짜·시각에서 시각만 HH:mm 글자로 얻습니다. 시각 입력칸에 넣는 모양입니다.
 * @param date 날짜·시각
 * @returns HH:mm
 * @example getTimeOfDay(new Date(2026, 9, 20, 9, 5)); // '09:05'
 */
export const getTimeOfDay = (date: Date) =>
  `${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}`;

/**
 * 날짜는 그대로 두고 시각만 바꾼 새 날짜·시각을 만듭니다.
 * @param date 날짜·시각
 * @param time 바꿀 시각 (HH:mm). 비어 있으면 0시
 * @returns 시각을 바꾼 새 Date
 * @example createDateWithTime(new Date(2026, 9, 20, 9), '18:30'); // 2026-10-20 18:30
 */
export const createDateWithTime = (date: Date, time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);

  return next;
};

/**
 * 시각은 그대로 두고 날짜만 바꾼 새 날짜·시각을 만듭니다.
 * @param dateKey 바꿀 날짜 (YYYY-MM-DD)
 * @param time 시각을 가져올 날짜·시각
 * @returns 날짜를 바꾼 새 Date
 * @example createDateKeepingTime('2026-10-22', new Date(2026, 9, 20, 9)); // 2026-10-22 09:00
 */
export const createDateKeepingTime = (dateKey: string, time: Date) =>
  createDateWithTime(parseISO(dateKey), getTimeOfDay(time));
