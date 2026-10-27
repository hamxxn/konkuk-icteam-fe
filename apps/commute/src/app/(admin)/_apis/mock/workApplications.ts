import { formatNumber } from '@konkuk-icteam-fe/design-system/date';
import type { ApiJson } from '@/app/(student)/_apis/common';
import type { WorkApplicationSettings } from '../workApplications';
import { WORKERS_MOCK } from './workers';

type SavedApplication = {
  settings: ApiJson<WorkApplicationSettings>;
  userIds: number[];
};

const createMonthKey = (year: number, month: number) => `${year}-${formatNumber(month)}`;

const getCurrentMonth = () => {
  const today = new Date();
  return { year: today.getFullYear(), month: today.getMonth() + 1 };
};

/**
 * 근로신청을 열지 않고 지난 달 명단 목업을 만듭니다. 근로를 시작하기 전 달에는 넣지 않고, 달마다 한 명씩 돌아가며 쉽니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 그 달 근로학생 id 목록
 * @example createPastRosterMock(2026, 9); // [1, 2, 3, ...]
 */
const createPastRosterMock = (year: number, month: number) => {
  const monthKey = createMonthKey(year, month);
  const current = getCurrentMonth();
  const restingIndex =
    monthKey === createMonthKey(current.year, current.month)
      ? WORKERS_MOCK.length - 1
      : month % WORKERS_MOCK.length;

  return WORKERS_MOCK.filter(
    ({ workStartDate }, index) => workStartDate.slice(0, 7) <= monthKey && index !== restingIndex,
  ).map(({ userId }) => userId);
};

// 저장한 근로신청 (YYYY-MM → 신청). 이번 달은 이미 신청을 받아 명단이 정해져 있다
const SAVED_APPLICATIONS: Record<string, SavedApplication> = (() => {
  const { year, month } = getCurrentMonth();
  const previous = new Date(year, month - 2, 1);
  const previousMonthKey = createMonthKey(previous.getFullYear(), previous.getMonth() + 1);

  return {
    [createMonthKey(year, month)]: {
      settings: {
        applyStartDate: `${previousMonthKey}-20T09:00:00`,
        applyEndDate: `${previousMonthKey}-25T18:00:00`,
        maxConcurrentWorkers: 4,
        weeklyMinHours: 6,
        weeklyMaxHours: 15,
        monthlyMinHours: 30,
        monthlyMaxHours: 60,
        unavailableDates: [],
      },
      userIds: createPastRosterMock(year, month),
    },
  };
})();

export const getWorkApplicationMock = (year: number, month: number) =>
  SAVED_APPLICATIONS[createMonthKey(year, month)];

export const saveWorkApplicationMock = (
  year: number,
  month: number,
  application: SavedApplication,
) => {
  SAVED_APPLICATIONS[createMonthKey(year, month)] = application;
};

/**
 * 그 달 근로학생 id 목업을 얻습니다. 신청을 연 달은 그때 고른 학생, 지난 달은 정해진 명단, 아직 열지 않은 달은 비어 있습니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 그 달 근로학생 id 목록
 * @example getMonthlyUserIdsMock(2026, 10); // [1, 2, 3, 4, 5, 6, 7]
 */
export const getMonthlyUserIdsMock = (year: number, month: number) => {
  const saved = getWorkApplicationMock(year, month);
  if (saved) return saved.userIds;

  const current = getCurrentMonth();
  const isPastMonth = year * 12 + month < current.year * 12 + current.month;

  return isPastMonth ? createPastRosterMock(year, month) : [];
};
