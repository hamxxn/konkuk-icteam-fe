import {
  parseApiDate,
  parseApiDateTime,
  toApiDate,
  type TimeString,
} from '@/app/(student)/_apis/common';
import { getDayAttendanceShiftsMock } from './mock/attendances';

// 그날 한 사람의 이어진 근무 한 구간과 출근 기록. 점심시간으로 끊기면 두 구간이 된다
export type AttendanceShift = {
  userId: number;
  userName: string;
  start: TimeString;
  end: TimeString;
  // 출근 체크한 시각. 아직 출근하지 않았거나 결근했으면 null
  checkedInAt: Date | null;
};

export type GetAttendancesRequest = {
  date: Date;
};

export type GetAttendancesResponse = {
  date: Date;
  // 시작 시각 순
  shifts: AttendanceShift[];
};

/**
 * GET /admin/attendances?date=
 * 그날 근무 구간마다 출근 기록. 대시보드의 오늘 근로 현황과 근무 시간표 색에 쓴다
 */
export const getAttendances = ({ date }: GetAttendancesRequest): GetAttendancesResponse => {
  const dateKey = toApiDate(date);

  return {
    date: parseApiDate(dateKey),
    shifts: getDayAttendanceShiftsMock(dateKey).map((shift) => ({
      ...shift,
      checkedInAt: shift.checkedInAt ? parseApiDateTime(shift.checkedInAt) : null,
    })),
  };
};
