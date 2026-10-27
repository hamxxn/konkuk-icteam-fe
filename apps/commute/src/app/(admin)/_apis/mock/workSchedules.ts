import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import type { ApiJson } from '@/shared/apis/common';
import { checkLunchSlot, SLOT_TIMES } from '@/shared/config/slot';
import type { MonthlyWorkRecord } from '../workers';
import type { CreateWorkScheduleResponse, WorkScheduleSlot } from '../workSchedules';
import { getMonthlyUserIdsMock, getWorkApplicationMock } from './workApplications';
import { WORKERS_MOCK } from './workers';

// 근무 시간표·근무 기록 목업. 날짜와 사람만으로 값이 정해져서 화면마다 숫자가 어긋나지 않는다

const FIRST_WORK_HOUR = 9;
const LAST_WORK_HOUR = 18;
const MONTHLY_LIMIT_MINUTES = 60 * 60;
const DEFAULT_MAX_CONCURRENT_WORKERS = 4;

type DailyShift = { startHour: number; hours: number };

// 관리자가 넣은 배치와 뺀 배치. 새로 고침하면 처음으로 돌아간다
const ADDED_SCHEDULES: ApiJson<CreateWorkScheduleResponse>[] = [];
const DELETED_SCHEDULE_IDS = new Set<number>();

/**
 * 여러 숫자로 늘 같은 값을 내는 간단한 해시를 만듭니다. 목업 값을 날짜·사람마다 고정하는 데 씁니다.
 * @param values 섞을 숫자들
 * @returns 0 이상 9973 미만의 정수
 * @example createSeed(1, 3); // 늘 같은 값
 */
const createSeed = (...values: number[]) =>
  values.reduce((seed, value) => (seed * 31 + value) % 9973, 7);

/**
 * 한 사람의 그날 근무 시간을 얻습니다. 주말은 쉬고, 평일에도 사람마다 쉬는 요일이 하루씩 있습니다.
 * 근무 구간이 점심시간에 걸려도 점심시간 칸에는 넣지 않습니다.
 * @param userId 근로학생 id
 * @param date 날짜
 * @returns 시작 시와 근무 시간 수. 쉬는 날이면 null
 * @example getDailyShift(1, new Date(2026, 9, 23)); // { startHour: 14, hours: 3 }
 */
const getDailyShift = (userId: number, date: Date): DailyShift | null => {
  if (date.getDay() === 0 || date.getDay() === 6) return null;

  const seed = createSeed(userId - 1, date.getDay());
  if (seed % 5 === 0) return null;

  const hours = 3 + (seed % 2);
  const startHour = FIRST_WORK_HOUR + (seed % (LAST_WORK_HOUR - FIRST_WORK_HOUR - hours + 1));

  return { startHour, hours };
};

/**
 * 배치 한 건의 id를 만듭니다. 날짜·시작 시·사람이 같으면 늘 같은 값입니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param start 칸 시작 시각 (HH:mm)
 * @param userId 근로학생 id
 * @returns 배치 id
 * @example createScheduleId('2026-10-22', '09:30', 1); // 202610220930001
 */
const createScheduleId = (dateKey: string, start: string, userId: number) =>
  Number(
    `${dateKey.replaceAll('-', '')}${start.replace(':', '')}${String(userId).padStart(3, '0')}`,
  );

/**
 * 하루치 근무 칸 목업을 만듭니다. 9시부터 18시까지 30분 단위로, 그 시간에 근무하는 그 달 근로학생을 담습니다.
 * 점심시간 칸에는 근무자를 넣지 않습니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @returns 30분 단위 근무 칸 목록 (근무자가 없는 칸도 포함)
 * @example getDaySlotsMock('2026-10-23')[0]; // { start: '09:00', end: '09:30', users: [...] }
 */
export const getDaySlotsMock = (dateKey: string): WorkScheduleSlot[] => {
  const date = parseISO(dateKey);
  const roster = getMonthlyUserIdsMock(date.getFullYear(), date.getMonth() + 1);
  const shifts = WORKERS_MOCK.filter(({ userId }) => roster.includes(userId)).map(
    ({ userId, name }) => ({ userId, userName: name, shift: getDailyShift(userId, date) }),
  );

  return SLOT_TIMES.map(({ start, end }) => {
    const hour = Number(start.slice(0, 2));
    const baseUsers = checkLunchSlot(start)
      ? []
      : shifts
          .filter(
            ({ shift }) => shift && shift.startHour <= hour && hour < shift.startHour + shift.hours,
          )
          .map(({ userId, userName }) => ({
            scheduleId: createScheduleId(dateKey, start, userId),
            userId,
            userName,
          }));
    const addedUsers = ADDED_SCHEDULES.filter(
      (schedule) => schedule.date === dateKey && schedule.start === start,
    ).map(({ scheduleId, userId, userName }) => ({ scheduleId, userId, userName }));

    return {
      start,
      end,
      users: [...baseUsers, ...addedUsers].filter(
        ({ scheduleId }) => !DELETED_SCHEDULE_IDS.has(scheduleId),
      ),
    };
  });
};

export const getMaxConcurrentWorkersMock = (year: number, month: number) =>
  getWorkApplicationMock(year, month)?.settings.maxConcurrentWorkers ??
  DEFAULT_MAX_CONCURRENT_WORKERS;

export const createWorkScheduleMock = ({
  userId,
  date,
  start,
  end,
}: Pick<ApiJson<CreateWorkScheduleResponse>, 'userId' | 'date' | 'start' | 'end'>) => {
  const userName = WORKERS_MOCK.find((worker) => worker.userId === userId)?.name ?? '';
  const scheduleId = createScheduleId(date, start, userId);
  const schedule = { scheduleId, userId, userName, date, start, end };

  DELETED_SCHEDULE_IDS.delete(scheduleId);
  ADDED_SCHEDULES.push(schedule);

  return schedule;
};

export const deleteWorkScheduleMock = (scheduleId: number) => {
  DELETED_SCHEDULE_IDS.add(scheduleId);
};

/**
 * 한 사람의 한 달 근무 기록 목업을 얻습니다.
 * @param userId 근로학생 id
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 누적 시간(분)과 한도, 지각·근무 변경 횟수
 * @example getMonthlyRecordMock(1, 2026, 10).monthlyLimitMinutes; // 3600
 */
export const getMonthlyRecordMock = (
  userId: number,
  year: number,
  month: number,
): MonthlyWorkRecord => {
  const seed = createSeed(userId - 1, month - 1, year);
  const lateCount = seed % 3;
  const totalChangeRequestCount = seed % 4;

  return {
    monthlyWorkedMinutes: Math.min(((seed % 40) + 12) * 60 + 30, MONTHLY_LIMIT_MINUTES),
    monthlyLimitMinutes: MONTHLY_LIMIT_MINUTES,
    lateCount,
    lateMinutes: lateCount * (5 + (seed % 10)),
    totalChangeRequestCount,
    approvedChangeRequestCount: Math.floor(totalChangeRequestCount / 2),
  };
};
