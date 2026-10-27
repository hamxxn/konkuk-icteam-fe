import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import type { ApiJson } from '@/shared/apis/common';
import { LUNCH_BREAK, SLOT_MINUTES, SLOT_TIMES } from '@/shared/config/slot';
import { MIN_WORK_HOURS_PER_SHIFT } from '@/shared/config/workHours';
import { checkWeekend } from '@/shared/utils/calendar';
import { checkLunchSlot } from '@/shared/utils/slot';
import type { MonthlyWorkRecord } from '../workers';
import type { CreateWorkScheduleResponse, WorkScheduleSlot } from '../workSchedules';
import { getMonthlyUserIdsMock, getWorkApplicationMock } from './workApplications';
import { WORKERS_MOCK } from './workers';

// 근무 시간표·근무 기록 목업. 날짜와 사람만으로 값이 정해져서 화면마다 숫자가 어긋나지 않는다

const MONTHLY_LIMIT_MINUTES = 60 * 60;
const DEFAULT_MAX_CONCURRENT_WORKERS = 4;

// 이어진 근무 한 구간의 최소 칸 수 (1시간 = 30분 칸 2개)
const MIN_SLOTS_PER_SHIFT = (MIN_WORK_HOURS_PER_SHIFT * 60) / SLOT_MINUTES;
// 하루 근무 길이는 점심시간을 포함해 6~8칸 (3시간 ~ 4시간, 30분 단위)
const MIN_DAILY_SLOT_COUNT = 6;
const DAILY_SLOT_COUNT_VARIANTS = 3;

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
 * 시작 칸부터 몇 칸 동안의 근무 칸 시작 시각을 만듭니다. 점심시간 칸은 뺍니다.
 * @param startIndex 하루 칸(SLOT_TIMES) 중 시작 칸의 순서
 * @param slotCount 점심시간을 포함한 칸 수
 * @returns 근무 칸 시작 시각 목록 (HH:mm)
 * @example createShiftStartTimes(4, 6); // ['11:00', '13:00', '13:30', '14:00'] (11:30~13:00은 점심)
 */
const createShiftStartTimes = (startIndex: number, slotCount: number) =>
  SLOT_TIMES.slice(startIndex, startIndex + slotCount)
    .map(({ start }) => start)
    .filter((start) => !checkLunchSlot(start));

/**
 * 점심시간으로 끊긴 앞뒤 근무가 모두 최소 근무 시간 이상인지 확인합니다. 30분만 근무하는 구간은 안 됩니다.
 * @param startTimes 하루 근무 칸 시작 시각 목록 (HH:mm, 점심 칸 제외)
 * @returns 점심 앞·뒤 구간이 각각 없거나 최소 칸 수 이상이면 true
 * @example checkShiftLongEnough(['11:00', '13:00', '13:30']); // false (11:00~11:30만 근무)
 */
const checkShiftLongEnough = (startTimes: string[]) => {
  const beforeLunchCount = startTimes.filter((start) => start < LUNCH_BREAK.start).length;
  const afterLunchCount = startTimes.filter((start) => start >= LUNCH_BREAK.end).length;

  return (
    beforeLunchCount + afterLunchCount > 0 &&
    [beforeLunchCount, afterLunchCount].every(
      (count) => count === 0 || count >= MIN_SLOTS_PER_SHIFT,
    )
  );
};

/**
 * 한 사람의 그날 근무 칸을 얻습니다. 주말은 쉬고, 평일에도 사람마다 쉬는 요일이 하루씩 있습니다.
 * 근무는 30분 단위로 시작하고 끝나며, 점심시간 칸에는 넣지 않습니다. 점심으로 끊긴 구간도 최소 근무 시간 이상입니다.
 * @param userId 근로학생 id
 * @param date 날짜
 * @returns 근무 칸 시작 시각 목록 (HH:mm). 쉬는 날이면 빈 배열
 * @example getDailyShiftStartTimes(1, new Date(2026, 9, 23)); // ['14:00', '14:30', ..., '16:30']
 */
const getDailyShiftStartTimes = (userId: number, date: Date) => {
  if (checkWeekend(date)) return [];

  const seed = createSeed(userId - 1, date.getDay());
  if (seed % 5 === 0) return [];

  const slotCount = MIN_DAILY_SLOT_COUNT + (seed % DAILY_SLOT_COUNT_VARIANTS);
  const shiftCandidates = Array.from(
    { length: SLOT_TIMES.length - slotCount + 1 },
    (_, startIndex) => createShiftStartTimes(startIndex, slotCount),
  ).filter(checkShiftLongEnough);

  return shiftCandidates[seed % shiftCandidates.length] ?? [];
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
    ({ userId, name }) => ({
      userId,
      userName: name,
      startTimes: getDailyShiftStartTimes(userId, date),
    }),
  );

  return SLOT_TIMES.map(({ start, end }) => {
    const baseUsers = shifts
      .filter(({ startTimes }) => startTimes.includes(start))
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
  if (checkLunchSlot(start)) throw new Error('점심시간 칸에는 근무를 넣을 수 없습니다.');

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
