import type { TimeString } from '@/app/(student)/_apis/common';

// 하루 안의 시작·끝 시각 (HH:mm). 30분 근무 칸이나 이어진 근무 구간에 쓴다
export type TimeRange = {
  start: TimeString;
  end: TimeString;
};

/**
 * 시작 시각 순으로 놓인 칸들 중 이어진 칸(앞 칸의 끝 = 다음 칸의 시작)을 한 구간으로 묶습니다.
 * 점심시간처럼 사이가 비면 다른 구간이 됩니다.
 * @param slots 시작 시각 순 칸 목록
 * @returns 이어진 구간 목록
 * @example mergeContinuousSlots([{ start: '09:00', end: '09:30' }, { start: '09:30', end: '10:00' }]); // [{ start: '09:00', end: '10:00' }]
 */
export const mergeContinuousSlots = (slots: TimeRange[]) =>
  slots.reduce<TimeRange[]>((ranges, { start, end }) => {
    const lastRange = ranges.at(-1);

    return lastRange && lastRange.end === start
      ? [...ranges.slice(0, -1), { start: lastRange.start, end }]
      : [...ranges, { start, end }];
  }, []);
