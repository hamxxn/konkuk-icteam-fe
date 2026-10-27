import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { getMonthlyRecordMock } from '@/app/(admin)/_apis/mock/workSchedules';
import { addDays, getMondayOfWeek } from '@/shared/utils/week';
import { SLOT_MINUTES } from '@/shared/config/slot';
import { MY_USER_ID } from './me';
import { getMyDaySlotsMock } from './workSchedules';

/**
 * 내 근무 기록 목업을 얻습니다. 이번 달은 관리자 근무 기록(근로장학생 월별 탭)과 같은 값을 쓰고,
 * 이번 주는 월요일부터 그날까지 내가 배치된 칸을 셉니다.
 * @param dateKey 기준일 (YYYY-MM-DD)
 * @returns 이번 주·이번 달 근무 시간 (분)
 * @example getMyWorkRecordMock('2026-10-27').weeklyWorkedMinutes; // 240
 */
export const getMyWorkRecordMock = (dateKey: string) => {
  const date = parseISO(dateKey);
  const monday = getMondayOfWeek(date);
  const passedDays = Math.round((date.getTime() - monday.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  const weeklyWorkedMinutes = Array.from({ length: passedDays }, (_, index) =>
    toISO(addDays(monday, index)),
  ).reduce((sum, weekDateKey) => sum + getMyDaySlotsMock(weekDateKey).length * SLOT_MINUTES, 0);
  const { monthlyWorkedMinutes } = getMonthlyRecordMock(
    MY_USER_ID,
    date.getFullYear(),
    date.getMonth() + 1,
  );

  return {
    weeklyWorkedMinutes,
    monthlyWorkedMinutes: Math.max(monthlyWorkedMinutes, weeklyWorkedMinutes),
  };
};
