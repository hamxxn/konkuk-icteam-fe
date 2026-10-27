import { addDays } from '@/shared/components/timetable/utils';
import { parseApiDate, toApiDate, type TimeString } from './common';
import {
  getMyDaySlotsMock,
  getTeamDaySlotsMock,
  getTeamMaxConcurrentWorkersMock,
} from './mock/workSchedules';

// 관리자 근무 시간표(GET /admin/work-schedules)와 같은 모양이다

// 한 칸에 배치된 근로학생. scheduleId는 이 사람의 이 칸 배치 한 건이다
export type WorkScheduleUser = {
  scheduleId: number;
  userId: number;
  userName: string;
};

// 30분 단위 근무 칸 (예: 09:00~09:30). 아무도 없는 칸도 users가 빈 배열로 온다
export type WorkScheduleSlot = {
  start: TimeString;
  end: TimeString;
  users: WorkScheduleUser[];
};

export type WorkScheduleDay = {
  date: Date;
  // 09:00부터 18:00까지 18칸. 점심시간(11:30~13:00) 칸도 온다
  slots: WorkScheduleSlot[];
};

// 기간의 첫날과 마지막 날 (둘 다 포함)
export type GetWorkSchedulesRequest = {
  startDate: Date;
  endDate: Date;
};

export type GetWorkSchedulesResponse = {
  startDate: Date;
  endDate: Date;
  // 그 달 근로신청 기준의 동시 근무 최대 인원
  maxConcurrentWorkers: number;
  // 기간 안의 모든 날짜가 순서대로 온다 (주말 포함)
  days: WorkScheduleDay[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 기간 안의 날짜를 YYYY-MM-DD로 늘어놓습니다.
 * @param startDate 첫날
 * @param endDate 마지막 날 (포함)
 * @returns 날짜 목록
 * @example getDateKeysBetween(new Date(2026, 9, 19), new Date(2026, 9, 23)).length; // 5
 */
const getDateKeysBetween = (startDate: Date, endDate: Date) => {
  const firstDate = parseApiDate(toApiDate(startDate));
  const dayCount =
    Math.round((parseApiDate(toApiDate(endDate)).getTime() - firstDate.getTime()) / DAY_MS) + 1;

  return Array.from({ length: Math.max(dayCount, 0) }, (_, index) =>
    toApiDate(addDays(firstDate, index)),
  );
};

/**
 * GET /me/work-schedules?startDate=&endDate=
 * 기간 안의 팀 근무 시간표. 칸마다 함께 근무하는 사람이 온다 (시간표 '자세히'에서 쓴다)
 */
export const getWorkSchedules = ({
  startDate,
  endDate,
}: GetWorkSchedulesRequest): GetWorkSchedulesResponse => ({
  startDate,
  endDate,
  maxConcurrentWorkers: getTeamMaxConcurrentWorkersMock(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
  ),
  days: getDateKeysBetween(startDate, endDate).map((dateKey) => ({
    date: parseApiDate(dateKey),
    slots: getTeamDaySlotsMock(dateKey),
  })),
});

export type GetMyWorkSchedulesRequest = GetWorkSchedulesRequest;

// 내가 배치된 30분 칸. scheduleId는 출근할 때 보낸다
export type MyWorkScheduleSlot = {
  scheduleId: number;
  start: TimeString;
  end: TimeString;
};

export type GetMyWorkSchedulesResponse = {
  startDate: Date;
  endDate: Date;
  // 기간 안의 모든 날짜가 순서대로 오고, 칸은 내가 배치된 칸만 온다
  days: { date: Date; slots: MyWorkScheduleSlot[] }[];
};

/**
 * GET /me/work-schedules/mine?startDate=&endDate=
 * 기간 안에서 내가 배치된 근무 칸
 */
export const getMyWorkSchedules = ({
  startDate,
  endDate,
}: GetMyWorkSchedulesRequest): GetMyWorkSchedulesResponse => ({
  startDate,
  endDate,
  days: getDateKeysBetween(startDate, endDate).map((dateKey) => ({
    date: parseApiDate(dateKey),
    slots: getMyDaySlotsMock(dateKey),
  })),
});
