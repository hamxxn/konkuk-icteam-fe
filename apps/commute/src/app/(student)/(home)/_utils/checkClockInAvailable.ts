import type { WorkShift } from '@/app/(student)/_apis/workShifts';
import { convertTimeToMinutes } from '@/shared/utils/time';

// 근무 시작 몇 분 전부터 출근할 수 있는지
const CLOCK_IN_AVAILABLE_BEFORE_MINUTES = 10;

/**
 * 지금 이 근무에 출근할 수 있는지 확인합니다. 아직 출근하지 않았고, 근무 시작 10분 전부터 종료 시각 사이면 출근할 수 있습니다.
 * @param shift 근무 (start·end는 HH:mm)
 * @param now 기준 시각
 * @returns 출근할 수 있으면 true
 * @example checkClockInAvailable({ start: '14:00', end: '16:00', checkedInAt: null }, new Date(2026, 9, 22, 13, 55)); // true
 */
export const checkClockInAvailable = (
  shift: Pick<WorkShift, 'start' | 'end' | 'checkedInAt'>,
  now: Date,
) => {
  if (shift.checkedInAt) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    nowMinutes >= convertTimeToMinutes(shift.start) - CLOCK_IN_AVAILABLE_BEFORE_MINUTES &&
    nowMinutes < convertTimeToMinutes(shift.end)
  );
};
