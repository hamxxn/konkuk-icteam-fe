import { parseApiDate, parseApiDateTime, toApiDate, type ApiJson, type TimeString } from './common';
import { clockInMock, getMyWorkDatesMock, getMyWorkShiftsMock } from './mock/workShifts';
import type { TodoPeriod } from './todos';

// 근무 상태 코드. WK01 예정 · WK02 근무중 · WK03 근무 완료 · WK04 결근
export type WorkStatusCode = 'WK01' | 'WK02' | 'WK03' | 'WK04';

// 하루 근무 한 건. 내가 배치된 30분 칸을 오전·오후로 나눠 이어진 구간으로 묶은 것
export type WorkShift = {
  // 이 근무에 묶인 칸 배치 id (관리자 시간표의 scheduleId). 출근할 때 보낸다
  scheduleIds: number[];
  // 오전·오후 근무. 그 시간대 업무를 본다
  period: TodoPeriod;
  start: TimeString;
  end: TimeString;
  workStatusCode: WorkStatusCode;
  // 출근 체크한 시각. 아직 출근하지 않았으면 null
  checkedInAt: Date | null;
};

export type GetMyWorkShiftsRequest = {
  date: Date;
};

export type GetMyWorkShiftsResponse = {
  date: Date;
  // 오전·오후 최대 1건씩, 시작 시각 순. 근무가 없으면 빈 배열
  shifts: WorkShift[];
};

export type GetMyWorkDatesRequest = {
  year: number;
  // 1~12
  month: number;
};

export type GetMyWorkDatesResponse = {
  year: number;
  month: number;
  // 그 달 내 근무가 있는 날
  dates: Date[];
};

// 출근 체크. 근무 시작 10분 전부터 끝날 때까지 할 수 있다
export type ClockInRequest = {
  scheduleIds: number[];
};

export type ClockInResponse = WorkShift;

const toWorkShift = (json: ApiJson<WorkShift>): WorkShift => ({
  ...json,
  checkedInAt: json.checkedInAt ? parseApiDateTime(json.checkedInAt) : null,
});

/**
 * GET /me/work-shifts?date=
 * 그날 내 근무와 출근 상태
 */
export const getMyWorkShifts = ({ date }: GetMyWorkShiftsRequest): GetMyWorkShiftsResponse => {
  const dateKey = toApiDate(date);

  return { date: parseApiDate(dateKey), shifts: getMyWorkShiftsMock(dateKey).map(toWorkShift) };
};

/**
 * GET /me/work-dates?year=&month=
 * 그 달 내 근무가 있는 날짜 (근무 달력 표시용)
 */
export const getMyWorkDates = ({ year, month }: GetMyWorkDatesRequest): GetMyWorkDatesResponse => ({
  year,
  month,
  dates: getMyWorkDatesMock(year, month).map(parseApiDate),
});

/**
 * POST /me/attendances
 * body: { scheduleIds }. 출근 체크한 근무를 돌려준다
 */
export const clockIn = ({ scheduleIds }: ClockInRequest): ClockInResponse =>
  toWorkShift(clockInMock(scheduleIds));
