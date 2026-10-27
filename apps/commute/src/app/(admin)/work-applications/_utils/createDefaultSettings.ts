import type { WorkApplicationSettings } from '../../_apis/workApplications';
import { parseMonthKey } from '../../_utils/monthKey';

/**
 * 아직 신청을 열지 않은 달의 기본 근로신청 설정을 만듭니다. 신청은 전달 20일 오전 9시부터 25일 오후 6시까지 받습니다.
 * @param monthKey 신청을 받을 달 (YYYY-MM)
 * @returns 기본 설정
 * @example createDefaultSettings('2026-11').applyStartDate; // 2026년 10월 20일 09:00
 */
export const createDefaultSettings = (monthKey: string): WorkApplicationSettings => {
  const { year, month } = parseMonthKey(monthKey);

  return {
    applyStartDate: new Date(year, month - 2, 20, 9),
    applyEndDate: new Date(year, month - 2, 25, 18),
    maxConcurrentWorkers: 4,
    weeklyMinHours: 6,
    weeklyMaxHours: 15,
    monthlyMinHours: 30,
    monthlyMaxHours: 60,
    unavailableDates: [],
  };
};
