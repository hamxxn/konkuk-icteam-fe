import type { TimeString } from '@/app/(student)/_apis/common';
import { removeDuplicatesBy } from '@/shared/utils/array';
import type { TimeRange } from '@/shared/utils/timeRange';
import type { AttendanceShift } from '../../_apis/attendances';

// 근무 칸 하나의 근태. 예정 · 근무중 · 근무 완료 · 지각 · 결근
export type SlotAttendanceStatus = 'SCHEDULED' | 'WORKING' | 'DONE' | 'LATE' | 'ABSENT';

type ShiftAttendance = Pick<AttendanceShift, 'start' | 'end' | 'checkedInAt'>;

// 오늘 근로 현황에 보여 줄 사람
export type AttendanceUser = Pick<AttendanceShift, 'userId' | 'userName'>;

export type TodayAttendanceSummary = {
  // 근무 시간 중이고 출근한 사람
  workingUsers: AttendanceUser[];
  // 아직 시작하지 않은 근무가 남은 사람 (미리 출근 체크했어도 시작 전이면 여기에 든다)
  upcomingUsers: AttendanceUser[];
  // 오늘 늦게 출근했거나, 근무가 시작됐는데 아직 출근하지 않은 사람
  lateOrAbsentUsers: AttendanceUser[];
};

/**
 * 날짜와 시각으로 그 순간의 Date를 만듭니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param time 시각 (HH:mm)
 * @returns 그 순간 (한국 시간)
 * @example createDateTime('2026-10-27', '09:30').getHours(); // 9
 */
const createDateTime = (dateKey: string, time: TimeString) => new Date(`${dateKey}T${time}:00`);

/**
 * 근무 칸 하나의 근태를 얻습니다. 시작 전이면 예정, 출근 전에 시작한 칸은 지각(근무가 끝나도 안 오면 결근),
 * 출근한 뒤의 칸은 끝났으면 근무 완료, 진행 중이면 근무중입니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param slot 근무 칸
 * @param slot.start 칸 시작 시각 (HH:mm)
 * @param slot.end 칸 끝 시각 (HH:mm)
 * @param shift 그 칸이 속한 근무 구간과 출근 시각
 * @param now 기준 시각
 * @returns 칸의 근태
 * @example getSlotAttendanceStatus('2026-10-27', { start: '09:00', end: '09:30' }, shift, new Date(2026, 9, 27, 9, 10)); // 'WORKING'
 */
export const getSlotAttendanceStatus = (
  dateKey: string,
  slot: TimeRange,
  shift: ShiftAttendance,
  now: Date,
): SlotAttendanceStatus => {
  const slotStart = createDateTime(dateKey, slot.start);
  if (now < slotStart) return 'SCHEDULED';

  if (!shift.checkedInAt) return createDateTime(dateKey, shift.end) <= now ? 'ABSENT' : 'LATE';
  if (shift.checkedInAt > slotStart) return 'LATE';

  return createDateTime(dateKey, slot.end) <= now ? 'DONE' : 'WORKING';
};

/**
 * 한 사람의 근무 칸이 속한 근무 구간을 찾습니다.
 * @param shifts 그날 근무 구간과 출근 기록
 * @param userId 근로학생 id
 * @param slotStart 칸 시작 시각 (HH:mm)
 * @returns 그 칸을 포함하는 근무 구간. 없으면 undefined
 * @example findSlotShift(shifts, 1, '14:30')?.start; // '14:00'
 */
export const findSlotShift = (shifts: AttendanceShift[], userId: number, slotStart: TimeString) =>
  shifts.find(
    (shift) => shift.userId === userId && shift.start <= slotStart && slotStart < shift.end,
  );

/**
 * 오늘 근무 구간으로 근로 현황을 모읍니다. 한 사람은 한 묶음에 한 번만 들어가고, 오전 결근·오후 예정처럼 두 묶음에 함께 들 수 있습니다.
 * @param dateKey 오늘 (YYYY-MM-DD)
 * @param shifts 오늘 근무 구간과 출근 기록
 * @param now 기준 시각
 * @returns 근무중·출근 예정·지각/결근인 사람
 * @example getTodayAttendanceSummary('2026-10-27', shifts, new Date()).workingUsers.length; // 2
 */
export const getTodayAttendanceSummary = (
  dateKey: string,
  shifts: AttendanceShift[],
  now: Date,
): TodayAttendanceSummary => {
  const collectUsers = (isMatchingShift: (shift: AttendanceShift) => boolean) =>
    removeDuplicatesBy(
      shifts.filter(isMatchingShift).map(({ userId, userName }) => ({ userId, userName })),
      ({ userId }) => userId,
    );

  return {
    workingUsers: collectUsers(
      ({ start, end, checkedInAt }) =>
        checkedInAt !== null &&
        createDateTime(dateKey, start) <= now &&
        now < createDateTime(dateKey, end),
    ),
    upcomingUsers: collectUsers(({ start }) => now < createDateTime(dateKey, start)),
    lateOrAbsentUsers: collectUsers(({ start, checkedInAt }) => {
      const shiftStart = createDateTime(dateKey, start);

      return checkedInAt ? checkedInAt > shiftStart : shiftStart <= now;
    }),
  };
};
