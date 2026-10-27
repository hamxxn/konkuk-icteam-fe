import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { getMe } from '@/shared/apis/me';
import {
  getMyWorkApplication,
  getWorkApplicationSettings,
  type WorkApplicationSettings,
} from '@/shared/apis/workApplications';
import { getWorkSchedules } from '@/shared/apis/workSchedules';
import type { TimeTableSource } from '@/shared/components/timetable/types';
import { createSlotKey } from '@/shared/components/timetable/utils';
import { PUBLIC_HOLIDAYS } from '@/shared/config/holidays';
import { SLOT_MINUTES } from '@/shared/config/slot';
import { convertMinutesToTime, convertTimeToMinutes } from '@/shared/utils/time';
import { addDays, DAYS_PER_WEEK, getFirstWeekMonday } from '@/shared/utils/week';

// 한 달의 주차는 많아야 6주라, 1주차 월요일부터 6주를 보면 그 달 표를 모두 덮는다
const MAX_WEEKS_PER_MONTH = 6;

/**
 * 근무할 수 없는 날을 모읍니다. 공휴일과 관리자가 그 달 막아 둔 날입니다.
 * @param settings 그 달 근로신청 기준 (없으면 null)
 * @returns 날짜 목록 ('YYYY-MM-DD')
 * @example getUnavailableDateKeys(null); // 공휴일만
 */
const getUnavailableDateKeys = (settings: WorkApplicationSettings | null) => [
  ...PUBLIC_HOLIDAYS,
  ...(settings?.unavailableDates.map(toISO) ?? []),
];

/**
 * 이번 달 시간표(조회·수정 요청)에 쓸 데이터를 만듭니다. 팀 근무 시간표에서 내 칸과 칸별 근무자를 고릅니다.
 * @param target 대상 달과 기준 시각
 * @param target.year 연도
 * @param target.month 월 (1~12)
 * @param target.editableFrom 이 시각보다 먼저 시작하는 칸은 고칠 수 없다
 * @returns 시간표 데이터
 * @example createScheduleSource({ year: 2026, month: 10, editableFrom: new Date() });
 */
export const createScheduleSource = ({
  year,
  month,
  editableFrom,
}: {
  year: number;
  month: number;
  editableFrom: Date;
}): TimeTableSource => {
  const { userId } = getMe();
  const { settings } = getWorkApplicationSettings({ year, month });
  const firstMonday = getFirstWeekMonday(year, month);
  const { maxConcurrentWorkers, days } = getWorkSchedules({
    startDate: firstMonday,
    endDate: addDays(firstMonday, MAX_WEEKS_PER_MONTH * DAYS_PER_WEEK - 1),
  });
  const slots = days.flatMap(({ date, slots: daySlots }) =>
    daySlots.map(({ start, users }) => ({ key: createSlotKey(toISO(date), start), users })),
  );

  return {
    mySlotKeys: new Set(
      slots
        .filter(({ users }) => users.some((user) => user.userId === userId))
        .map(({ key }) => key),
    ),
    workersBySlot: Object.fromEntries(
      slots.map(({ key, users }) => [key, users.map(({ userName }) => userName)]),
    ),
    maxConcurrentWorkers,
    unavailableDates: getUnavailableDateKeys(settings),
    weeklyMaxHours: settings?.weeklyMaxHours ?? Number.POSITIVE_INFINITY,
    editableFrom,
  };
};

/**
 * 다음 달 근로신청에 쓸 데이터를 만듭니다. 내가 이미 신청한 근무를 한 시간 칸으로 나눕니다.
 * @param target 대상 달과 기준 시각
 * @param target.year 연도
 * @param target.month 월 (1~12)
 * @param target.editableFrom 이 시각보다 먼저 시작하는 칸은 고를 수 없다
 * @returns 시간표 데이터
 * @example createApplySource({ year: 2026, month: 11, editableFrom: new Date() });
 */
export const createApplySource = ({
  year,
  month,
  editableFrom,
}: {
  year: number;
  month: number;
  editableFrom: Date;
}): TimeTableSource => {
  const { settings } = getWorkApplicationSettings({ year, month });
  const { schedules } = getMyWorkApplication({ year, month });
  const mySlotKeys = schedules.flatMap(({ date, start, end }) => {
    const slotCount = (convertTimeToMinutes(end) - convertTimeToMinutes(start)) / SLOT_MINUTES;

    return Array.from({ length: slotCount }, (_, index) => {
      const startMinutes = convertTimeToMinutes(start) + index * SLOT_MINUTES;

      return createSlotKey(toISO(date), convertMinutesToTime(startMinutes));
    });
  });

  return {
    mySlotKeys: new Set(mySlotKeys),
    workersBySlot: {},
    maxConcurrentWorkers: settings?.maxConcurrentWorkers ?? 0,
    unavailableDates: getUnavailableDateKeys(settings),
    weeklyMaxHours: settings?.weeklyMaxHours ?? Number.POSITIVE_INFINITY,
    editableFrom,
  };
};
