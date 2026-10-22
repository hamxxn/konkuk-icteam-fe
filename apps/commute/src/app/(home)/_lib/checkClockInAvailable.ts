import type { HomeTodaySchedule } from '../_types';

// 근무 시작 몇 분 전부터 출근할 수 있는지
const CLOCK_IN_AVAILABLE_BEFORE_MINUTES = 10;

const toMinutes = (time: string) => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);

  return hours * 60 + minutes;
};

/**
 * 지금 이 근무에 출근할 수 있는지 확인합니다. 아직 출근하지 않았고, 근무 시작 10분 전부터 종료 시각 사이면 출근할 수 있습니다.
 * @param schedule 근무 일정 응답 (start·end는 HH:MM 또는 HH:MM:SS)
 * @param now 기준 시각
 * @returns 출근할 수 있으면 true
 * @example checkClockInAvailable({ ...schedule, start: '14:30', end: '16:30', checkedIn: false }, new Date('2026-10-22T14:25')); // true
 */
export const checkClockInAvailable = (
  schedule: Pick<HomeTodaySchedule, 'start' | 'end' | 'checkedIn'>,
  now: Date,
) => {
  if (schedule.checkedIn) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    nowMinutes >= toMinutes(schedule.start) - CLOCK_IN_AVAILABLE_BEFORE_MINUTES &&
    nowMinutes <= toMinutes(schedule.end)
  );
};
