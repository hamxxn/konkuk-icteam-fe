import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { parseApiDate, toApiDate, type TimeString } from './common';
import {
  createWorkScheduleMock,
  deleteWorkScheduleMock,
  getDaySlotsMock,
  getMaxConcurrentWorkersMock,
} from './mock/workSchedules';

// 한 칸에 배치된 근로학생. scheduleId는 이 사람의 이 칸 배치 한 건이다 (뺄 때 보낸다)
export type WorkScheduleUser = {
  scheduleId: number;
  userId: number;
  userName: string;
};

// 한 시간 단위 근무 칸 (예: 09:00~10:00). 아무도 없는 칸도 users가 빈 배열로 온다
export type WorkScheduleSlot = {
  start: TimeString;
  end: TimeString;
  users: WorkScheduleUser[];
};

export type WorkScheduleDay = {
  date: Date;
  // 09:00부터 18:00까지 9칸
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
  // 그 달 근로신청 기준의 동시 근무 최대 인원. 넘겨도 배치는 되고 화면에서 알려 준다
  maxConcurrentWorkers: number;
  // 기간 안의 모든 날짜가 순서대로 온다 (주말 포함)
  days: WorkScheduleDay[];
};

// 관리자가 근로학생을 한 칸에 바로 넣는다. 승인 절차 없이 확정된다
export type CreateWorkScheduleRequest = {
  userId: number;
  date: Date;
  start: TimeString;
  end: TimeString;
};

export type CreateWorkScheduleResponse = WorkScheduleUser & {
  date: Date;
  start: TimeString;
  end: TimeString;
};

export type DeleteWorkScheduleRequest = {
  scheduleId: number;
};

/**
 * GET /admin/work-schedules?startDate=&endDate=
 * 기간 안의 날마다 한 시간 단위 근무 칸과 배치된 사람. 대시보드는 하루, 근로시간 관리는 월~금을 조회한다
 */
export const getWorkSchedules = ({
  startDate,
  endDate,
}: GetWorkSchedulesRequest): GetWorkSchedulesResponse => {
  const dayCount =
    Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  const dateKeys = Array.from({ length: dayCount }, (_, index) => {
    const date = parseISO(toApiDate(startDate));
    date.setDate(date.getDate() + index);
    return toApiDate(date);
  });

  return {
    startDate,
    endDate,
    maxConcurrentWorkers: getMaxConcurrentWorkersMock(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
    ),
    days: dateKeys.map((dateKey) => ({
      date: parseApiDate(dateKey),
      slots: getDaySlotsMock(dateKey),
    })),
  };
};

/**
 * POST /admin/work-schedules
 * 근무 칸에 근로학생을 넣는다. 이미 그 칸에 있으면 409
 */
export const createWorkSchedule = ({
  userId,
  date,
  start,
  end,
}: CreateWorkScheduleRequest): CreateWorkScheduleResponse => {
  const json = createWorkScheduleMock({ userId, date: toApiDate(date), start, end });

  return { ...json, date: parseApiDate(json.date) };
};

/**
 * DELETE /admin/work-schedules/{scheduleId}
 * 근무 칸에서 근로학생을 뺀다. 응답 본문은 없다
 */
export const deleteWorkSchedule = ({ scheduleId }: DeleteWorkScheduleRequest) => {
  deleteWorkScheduleMock(scheduleId);
};
