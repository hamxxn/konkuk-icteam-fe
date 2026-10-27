import { formatNumber } from '@konkuk-icteam-fe/design-system/date';

const MINUTES_PER_HOUR = 60;

/**
 * 'HH:mm' 형식의 시각을 자정부터 지난 분으로 바꿉니다.
 * @param time 'HH:mm' 형식의 시각
 * @returns 자정부터 지난 분
 * @example const minutes = convertTimeToMinutes('09:30'); // 570
 */
export const convertTimeToMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);

  return hours * MINUTES_PER_HOUR + minutes;
};

/**
 * 자정부터 지난 분을 'HH:mm' 형식의 시각으로 바꿉니다.
 * @param minutesFromMidnight 자정부터 지난 분
 * @returns 'HH:mm' 형식의 시각
 * @example const time = convertMinutesToTime(570); // '09:30'
 */
export const convertMinutesToTime = (minutesFromMidnight: number) =>
  `${formatNumber(Math.floor(minutesFromMidnight / MINUTES_PER_HOUR))}:${formatNumber(minutesFromMidnight % MINUTES_PER_HOUR)}`;
