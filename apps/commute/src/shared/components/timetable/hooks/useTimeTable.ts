import { useState } from 'react';

import { SLOT_MINUTES } from '@/shared/config/slot';
import { MIN_WORK_HOURS_PER_SHIFT, WORK_HOUR_LIMITS } from '@/shared/config/workHours';

import {
  APPLY_NEXT_STATUS,
  EDIT_NEXT_STATUS,
  LUNCH_BREAK,
  SLOT_START_TIMES,
  WEEKDAY_LABELS,
} from '../constants';
import type {
  SlotCellData,
  SlotEdit,
  SlotStatus,
  TimeRange,
  TimeTableCell,
  TimeTableDay,
  TimeTableMode,
} from '../types';
import { formatDateKey, formatMonthDay, hasTimeInRanges } from '../utils';

const MOCK_MAX_COUNT = 5;
// 근무로 치는 상태. 삭제 예정은 빠질 칸이라 넣지 않는다.
const WORKING_STATUSES: SlotStatus[] = ['APPLIED', 'PENDING_ADD'];
const MINUTES_PER_HOUR = 60;
const MIN_SLOTS_PER_SHIFT = (MIN_WORK_HOURS_PER_SHIFT * MINUTES_PER_HOUR) / SLOT_MINUTES;
const MAX_SLOTS_PER_WEEK = (WORK_HOUR_LIMITS.week * MINUTES_PER_HOUR) / SLOT_MINUTES;
const MOCK_WORKERS = ['김건국', '이정보', '박운영'];

type DaySchedule = {
  appliedTimes: TimeRange[];
  // 운영시간·점심시간 말고 따로 막힌 시간
  unavailableTimes: TimeRange[];
};

// todo: 해당 년, 주차에 대한 데이터 조회로 교체. 지금은 요일(월~금)마다 같은 목업을 쓴다.
const MOCK_WEEKDAY_SCHEDULES: DaySchedule[] = [
  { appliedTimes: [], unavailableTimes: [] },
  { appliedTimes: [{ start: '09:00', end: '11:30' }], unavailableTimes: [] },
  {
    appliedTimes: [
      { start: '09:00', end: '11:30' },
      { start: '13:00', end: '14:30' },
    ],
    unavailableTimes: [],
  },
  {
    appliedTimes: [
      { start: '10:00', end: '11:30' },
      { start: '13:00', end: '17:30' },
    ],
    unavailableTimes: [],
  },
  { appliedTimes: [], unavailableTimes: [] },
];

const EMPTY_DAY_SCHEDULE: DaySchedule = { appliedTimes: [], unavailableTimes: [] };

const createSlotKey = (dateKey: string, startTime: string) => `${dateKey}-${startTime}`;

// 다음 달에 이미 신청해 둔 근무 목업. 신청 화면에서 마감 전까지 바꿀 수 있다.
const MOCK_NEXT_MONTH_WEEKDAY_SCHEDULES: DaySchedule[] = [
  EMPTY_DAY_SCHEDULE,
  { appliedTimes: [{ start: '09:00', end: '11:00' }], unavailableTimes: [] },
  EMPTY_DAY_SCHEDULE,
  { appliedTimes: [{ start: '13:00', end: '15:00' }], unavailableTimes: [] },
  EMPTY_DAY_SCHEDULE,
];

// 'YYYY-MM-DD'의 연·월을 월 단위 순번으로 바꾼다. 두 날짜가 몇 달 차이인지 셀 때 쓴다.
const getMonthIndex = (dateKey: string) => {
  const [year = 0, month = 1] = dateKey.split('-').map(Number);

  return year * 12 + month;
};

// todo: 실제 조회 데이터로 교체. 목업은 이번 달과 다음 달에만 근무가 있다.
const getMockDaySchedule = (dateKey: string, todayKey: string) => {
  const [year = 0, month = 1, day = 1] = dateKey.split('-').map(Number);
  const weekdayIndex = new Date(year, month - 1, day).getDay() - 1;
  const monthOffset = getMonthIndex(dateKey) - getMonthIndex(todayKey);
  const schedules =
    monthOffset === 0
      ? MOCK_WEEKDAY_SCHEDULES
      : monthOffset === 1
        ? MOCK_NEXT_MONTH_WEEKDAY_SCHEDULES
        : [];

  return schedules[weekdayIndex] ?? EMPTY_DAY_SCHEDULE;
};

// 이어진 근무 칸 중 최소 근무 시간보다 짧은 구간이 있는지 확인한다. 점심·신청 불가 칸에서 구간이 끊긴다.
const checkHasShortShift = (statuses: SlotStatus[]) => {
  const shiftLengths = statuses.reduce<number[]>((lengths, status, index) => {
    if (!WORKING_STATUSES.includes(status)) return lengths;

    const isContinued = index > 0 && WORKING_STATUSES.includes(statuses[index - 1] ?? 'AVAILABLE');

    return isContinued ? [...lengths.slice(0, -1), (lengths.at(-1) ?? 0) + 1] : [...lengths, 1];
  }, []);

  return shiftLengths.some((length) => length < MIN_SLOTS_PER_SHIFT);
};

// 서버에서 받은 원래 상태. 추가·삭제 예정은 edit 모드에서 사용자가 만든다.
// 점심시간은 데이터와 상관없이 언제나 신청 불가다.
const getBaseSlotStatus = (
  { appliedTimes, unavailableTimes }: DaySchedule,
  startTime: string,
): SlotStatus => {
  if (hasTimeInRanges([LUNCH_BREAK, ...unavailableTimes], startTime)) return 'UNAVAILABLE';

  return hasTimeInRanges(appliedTimes, startTime) ? 'APPLIED' : 'AVAILABLE';
};

const createDay = (date: Date, index: number): TimeTableDay => ({
  date: formatDateKey(date),
  label: WEEKDAY_LABELS[index] ?? '',
  dateLabel: formatMonthDay(date),
});

// dates: 표에 그릴 월~금 날짜
export const useTimeTable = (mode: TimeTableMode, dates: Date[]) => {
  // edit·apply 모드에서 사용자가 바꾼 슬롯. key는 createSlotKey로 만든다.
  // 주차를 옮겨도 남아 있어서 여러 주를 한 번에 고칠 수 있다.
  const [editedSlots, setEditedSlots] = useState<Record<string, SlotEdit>>({});
  // 'YYYY-MM-DD'는 문자열 비교로 날짜 순서를 알 수 있다.
  const [todayKey] = useState(() => formatDateKey(new Date()));

  // 칸을 눌렀을 때 바뀌는 상태. 수정은 예정 상태를 거치고, 신청은 바로 바뀐다.
  const nextStatusMap = mode === 'apply' ? APPLY_NEXT_STATUS : EDIT_NEXT_STATUS;

  const handleEditSlot = (key: string, edit: SlotEdit) => {
    const nextStatus = nextStatusMap[edit.status];

    if (!nextStatus) return;

    setEditedSlots((prev) => ({ ...prev, [key]: { ...edit, status: nextStatus } }));
  };

  const resetEdits = () => {
    setEditedSlots({});
  };

  // 서버에서 받은 원래 상태
  const getOriginalStatus = (dateKey: string, startTime: string) =>
    getBaseSlotStatus(getMockDaySchedule(dateKey, todayKey), startTime);

  // 한 칸의 지금 상태. 사용자가 바꾼 값이 있으면 그것을, 없으면 원래 상태를 쓴다.
  const getSlotEdit = (dateKey: string, startTime: string): SlotEdit => {
    // 수정·신청 화면에서 지난 날짜는 고칠 수 없으니 신청 불가로 막는다.
    if ((mode === 'edit' || mode === 'apply') && dateKey < todayKey) {
      return { date: dateKey, startTime, status: 'UNAVAILABLE' };
    }

    return (
      editedSlots[createSlotKey(dateKey, startTime)] ?? {
        date: dateKey,
        startTime,
        status: getOriginalStatus(dateKey, startTime),
      }
    );
  };

  // 원래 상태와 달라진 칸만. 눌렀다가 되돌린 칸은 빠진다. 요청·신청할 때 이 목록을 보낸다.
  const changedSlots = Object.values(editedSlots).filter(
    ({ date, startTime, status }) => status !== getOriginalStatus(date, startTime),
  );

  const dateKeys = dates.map(formatDateKey);

  // 보고 있는 주의 근무 칸 수. 주 최대 시간을 채우면 빈 칸을 더 누를 수 없다.
  const weekWorkingSlotCount = dateKeys
    .flatMap((dateKey) => SLOT_START_TIMES.map((startTime) => getSlotEdit(dateKey, startTime)))
    .filter(({ status }) => WORKING_STATUSES.includes(status)).length;
  const weekHours = (weekWorkingSlotCount * SLOT_MINUTES) / MINUTES_PER_HOUR;
  const isWeekFull = weekWorkingSlotCount >= MAX_SLOTS_PER_WEEK;

  // 바꾼 칸이 있는 날 중 최소 근무 시간보다 짧은 구간이 생긴 날짜 ('YYYY-MM-DD', 오름차순)
  const getShortShiftDates = () =>
    [...new Set(changedSlots.map(({ date }) => date))]
      .filter((dateKey) =>
        checkHasShortShift(
          SLOT_START_TIMES.map((startTime) => getSlotEdit(dateKey, startTime).status),
        ),
      )
      .sort();

  const createSlotCellData = (key: string, edit: SlotEdit): SlotCellData => {
    const { status } = edit;

    if (mode === 'read') return { mode, status };

    if (mode === 'detail') {
      return {
        mode,
        status,
        // todo: 실제 슬롯 근무자 명단으로 교체
        workers: status === 'APPLIED' ? MOCK_WORKERS : [],
        maxCount: MOCK_MAX_COUNT,
      };
    }

    return {
      mode,
      status,
      onClick: () => handleEditSlot(key, edit),
      // 바꿀 수 없는 칸(신청 불가)은 막는다.
      // 주 최대 시간을 채웠으면 빈 칸은 더 추가할 수 없다. 이미 고른 칸은 되돌릴 수 있다.
      disabled: nextStatusMap[status] === undefined || (isWeekFull && status === 'AVAILABLE'),
    };
  };

  const createDayCells = (dateKey: string): TimeTableCell[] =>
    SLOT_START_TIMES.map((startTime) => {
      const key = createSlotKey(dateKey, startTime);

      return { ...createSlotCellData(key, getSlotEdit(dateKey, startTime)), key };
    });

  const days = dates.map(createDay);
  const cells = dateKeys.map(createDayCells);

  return { days, cells, changedSlots, resetEdits, weekHours, isWeekFull, getShortShiftDates };
};
