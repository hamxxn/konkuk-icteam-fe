import { describe, expect, it } from 'vitest';
import type { AttendanceShift } from '../../_apis/attendances';
import { getSlotAttendanceStatus, getTodayAttendanceSummary } from './attendanceStatus';

const DATE_KEY = '2026-10-27';

const at = (time: string) => new Date(`${DATE_KEY}T${time}:00`);

const createShift = (
  userId: number,
  start: string,
  end: string,
  checkedInAt: string | null,
): AttendanceShift => ({
  userId,
  userName: `학생${userId}`,
  start,
  end,
  checkedInAt: checkedInAt ? at(checkedInAt) : null,
});

describe('getSlotAttendanceStatus', () => {
  const slot = { start: '09:30', end: '10:00' };

  it('칸이 시작하기 전이면 예정이다', () => {
    expect(
      getSlotAttendanceStatus(DATE_KEY, slot, createShift(1, '09:00', '11:00', null), at('09:20')),
    ).toBe('SCHEDULED');
  });

  it('출근한 뒤의 칸은 진행 중이면 근무중, 끝났으면 근무 완료다', () => {
    const shift = createShift(1, '09:00', '11:00', '08:55');

    expect(getSlotAttendanceStatus(DATE_KEY, slot, shift, at('09:40'))).toBe('WORKING');
    expect(getSlotAttendanceStatus(DATE_KEY, slot, shift, at('10:00'))).toBe('DONE');
  });

  it('출근 전에 시작한 칸은 지각이다', () => {
    const shift = createShift(1, '09:00', '11:00', '09:40');

    expect(getSlotAttendanceStatus(DATE_KEY, slot, shift, at('10:30'))).toBe('LATE');
    expect(
      getSlotAttendanceStatus(DATE_KEY, { start: '10:00', end: '10:30' }, shift, at('10:30')),
    ).toBe('DONE');
  });

  it('출근하지 않았으면 근무 중에는 지각, 근무가 끝나면 결근이다', () => {
    const shift = createShift(1, '09:00', '11:00', null);

    expect(getSlotAttendanceStatus(DATE_KEY, slot, shift, at('10:00'))).toBe('LATE');
    expect(getSlotAttendanceStatus(DATE_KEY, slot, shift, at('11:00'))).toBe('ABSENT');
  });
});

describe('getTodayAttendanceSummary', () => {
  it('근무중·출근 예정·지각/결근인 사람을 나눠 모은다', () => {
    const summary = getTodayAttendanceSummary(
      DATE_KEY,
      [
        createShift(1, '09:00', '11:00', '08:55'),
        createShift(2, '09:00', '11:00', '09:20'),
        createShift(3, '09:00', '10:00', null),
        createShift(3, '13:00', '15:00', null),
        createShift(4, '14:00', '16:00', null),
      ],
      at('10:30'),
    );

    expect(summary.workingUsers.map(({ userId }) => userId)).toEqual([1, 2]);
    expect(summary.upcomingUsers.map(({ userId }) => userId)).toEqual([3, 4]);
    expect(summary.lateOrAbsentUsers.map(({ userId }) => userId)).toEqual([2, 3]);
  });

  it('미리 출근 체크했어도 근무 시작 전이면 근무 중이 아니라 출근 예정이다', () => {
    const summary = getTodayAttendanceSummary(
      DATE_KEY,
      [createShift(1, '09:00', '11:00', '08:56')],
      at('08:58'),
    );

    expect(summary.workingUsers).toEqual([]);
    expect(summary.upcomingUsers.map(({ userId }) => userId)).toEqual([1]);
  });
});
