import { formatNumber, parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { getWorkApplicationMock } from '@/app/(admin)/_apis/mock/workApplications';
import { getMonthDates } from '@/shared/utils/calendar';
import type { ApiJson, WorkTimeRange } from '../common';
import type { WorkApplicationSettings } from '../workApplications';
import { MY_USER_ID } from './me';

const createMonthKey = (year: number, month: number) => `${year}-${formatNumber(month)}`;

/**
 * 관리자가 아직 다음 달 신청을 열지 않았을 때 쓰는 데모 기준을 만듭니다. 신청 기간이 오늘을 포함해서 신청 화면을 확인할 수 있습니다.
 * @param today 기준일
 * @returns 신청 기준 JSON
 * @example createDemoSettings(new Date()).maxConcurrentWorkers; // 4
 */
const createDemoSettings = (today: Date): ApiJson<WorkApplicationSettings> => {
  const applyStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3);
  const applyEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

  return {
    applyStartDate: `${toISO(applyStart)}T09:00:00`,
    applyEndDate: `${toISO(applyEnd)}T18:00:00`,
    maxConcurrentWorkers: 4,
    weeklyMinHours: 6,
    weeklyMaxHours: 15,
    monthlyMinHours: 30,
    monthlyMaxHours: 60,
    unavailableDates: [],
  };
};

/**
 * 그 달 근로신청 기준 목업을 얻습니다. 관리자가 저장한 기준을 그대로 쓰고,
 * 관리자가 아직 열지 않은 다음 달은 신청 흐름을 볼 수 있게 데모 기준으로 연 것으로 둡니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 기준 JSON과 내가 신청할 수 있는지. 열지 않은 달이면 undefined
 * @example getWorkApplicationSettingsMock(2026, 11)?.settings.weeklyMaxHours; // 15
 */
export const getWorkApplicationSettingsMock = (year: number, month: number) => {
  const saved = getWorkApplicationMock(year, month);
  if (saved) return { settings: saved.settings, canApply: saved.userIds.includes(MY_USER_ID) };

  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const isNextMonth = nextMonth.getFullYear() === year && nextMonth.getMonth() + 1 === month;

  return isNextMonth ? { settings: createDemoSettings(today), canApply: true } : undefined;
};

/**
 * 처음 보여 줄 내 신청 목업을 만듭니다. 화요일 오전 09~11시, 목요일 오후 13~15시에 신청해 둔 상태입니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 신청 근무 JSON
 * @example createBaseApplication(2026, 11).length; // 화·목 수만큼
 */
const createBaseApplication = (year: number, month: number): ApiJson<WorkTimeRange>[] =>
  getMonthDates(new Date(year, month - 1, 1)).flatMap((dateKey) => {
    const day = parseISO(dateKey).getDay();
    if (day === 2) return [{ date: dateKey, start: '09:00', end: '11:00' }];
    if (day === 4) return [{ date: dateKey, start: '13:00', end: '15:00' }];

    return [];
  });

// 저장한 내 신청 (YYYY-MM → 신청 근무). 새로 고침하면 처음으로 돌아간다
const SAVED_APPLICATIONS: Record<string, ApiJson<WorkTimeRange>[]> = {};

export const getMyWorkApplicationMock = (year: number, month: number) =>
  SAVED_APPLICATIONS[createMonthKey(year, month)] ?? createBaseApplication(year, month);

export const saveMyWorkApplicationMock = (
  year: number,
  month: number,
  schedules: ApiJson<WorkTimeRange>[],
) => {
  SAVED_APPLICATIONS[createMonthKey(year, month)] = schedules;
};
