import { convertTimeToMinutes, MINUTES_PER_HOUR } from '@/shared/utils/time';
import { mergeContinuousSlots, type TimeRange } from '@/shared/utils/timeRange';

// 한 사람의 하루 안의 이어진 근무 한 구간
export type WorkerTimeRange = TimeRange & {
  dateKey: string;
  // 근무 길이 (분)
  minutes: number;
};

type WorkerScheduleDay = {
  dateKey: string;
  cells: (TimeRange & { users: { userId: number }[] })[];
};

/**
 * 한 주 시간표에서 한 사람이 근무하는 구간을 모읍니다. 이어진 30분 칸은 한 구간으로 묶고, 점심시간처럼 끊기면 나눕니다.
 * @param days 요일별 근무 칸 (날짜 순)
 * @param userId 근로학생 id
 * @returns 날짜·시작 순 근무 구간
 * @example getWorkerTimeRanges(days, 1)[0]; // { dateKey: '2026-10-20', start: '09:00', end: '10:00', minutes: 60 }
 */
export const getWorkerTimeRanges = (days: WorkerScheduleDay[], userId: number) =>
  days.flatMap(({ dateKey, cells }) =>
    mergeContinuousSlots(
      cells.filter(({ users }) => users.some((user) => user.userId === userId)),
    ).map(({ start, end }): WorkerTimeRange => ({
      dateKey,
      start,
      end,
      minutes: convertTimeToMinutes(end) - convertTimeToMinutes(start),
    })),
  );

/**
 * 근무 길이를 글자로 만듭니다.
 * @param minutes 근무 길이 (분)
 * @returns '1시간', '1시간 30분', '30분'
 * @example formatWorkDuration(90); // '1시간 30분'
 */
export const formatWorkDuration = (minutes: number) => {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const restMinutes = minutes % MINUTES_PER_HOUR;

  if (hours === 0) return `${restMinutes}분`;

  return restMinutes === 0 ? `${hours}시간` : `${hours}시간 ${restMinutes}분`;
};
