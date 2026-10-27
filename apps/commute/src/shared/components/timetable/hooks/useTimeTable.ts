import { useState } from 'react';

import { parseISO } from '@konkuk-icteam-fe/design-system/date';

import { checkLunchSlot, SLOT_MINUTES } from '@/shared/config/slot';
import { MIN_WORK_HOURS_PER_SHIFT } from '@/shared/config/workHours';

import {
  APPLY_NEXT_STATUS,
  EDIT_NEXT_STATUS,
  SLOT_START_TIMES,
  WEEKDAY_LABELS,
} from '../constants';
import type {
  SlotCellData,
  SlotEdit,
  SlotStatus,
  TimeTableCell,
  TimeTableDay,
  TimeTableMode,
  TimeTableSource,
} from '../types';
import { convertTimeToMinutes, createSlotKey, formatDateKey, formatMonthDay } from '../utils';

// 근무로 치는 상태. 삭제 예정은 빠질 칸이라 넣지 않는다.
const WORKING_STATUSES: SlotStatus[] = ['APPLIED', 'PENDING_ADD'];
const MINUTES_PER_HOUR = 60;
const MIN_SLOTS_PER_SHIFT = (MIN_WORK_HOURS_PER_SHIFT * MINUTES_PER_HOUR) / SLOT_MINUTES;

// 칸이 시작하는 시각
const getSlotStartDate = (dateKey: string, startTime: string) => {
  const date = parseISO(dateKey);
  date.setMinutes(convertTimeToMinutes(startTime));

  return date;
};

// 이어진 근무 칸 중 최소 근무 시간보다 짧은 구간이 있는지 확인한다. 신청 불가 칸에서 구간이 끊긴다.
const checkHasShortShift = (statuses: SlotStatus[]) => {
  const shiftLengths = statuses.reduce<number[]>((lengths, status, index) => {
    if (!WORKING_STATUSES.includes(status)) return lengths;

    const isContinued = index > 0 && WORKING_STATUSES.includes(statuses[index - 1] ?? 'AVAILABLE');

    return isContinued ? [...lengths.slice(0, -1), (lengths.at(-1) ?? 0) + 1] : [...lengths, 1];
  }, []);

  return shiftLengths.some((length) => length < MIN_SLOTS_PER_SHIFT);
};

const createDay = (date: Date, index: number): TimeTableDay => ({
  date: formatDateKey(date),
  label: WEEKDAY_LABELS[index] ?? '',
  dateLabel: formatMonthDay(date),
});

// dates: 표에 그릴 월~금 날짜, source: 화면이 조회한 근무·기준 데이터
export const useTimeTable = (mode: TimeTableMode, dates: Date[], source: TimeTableSource) => {
  // edit·apply 모드에서 사용자가 바꾼 슬롯. key는 createSlotKey로 만든다.
  // 주차를 옮겨도 남아 있어서 여러 주를 한 번에 고칠 수 있다.
  const [editedSlots, setEditedSlots] = useState<Record<string, SlotEdit>>({});
  const isEditable = mode === 'edit' || mode === 'apply';
  const maxSlotsPerWeek = (source.weeklyMaxHours * MINUTES_PER_HOUR) / SLOT_MINUTES;

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

  // 서버에서 받은 원래 상태. 근무할 수 없는 날과 점심시간은 언제나 신청 불가다.
  const getOriginalStatus = (dateKey: string, startTime: string): SlotStatus => {
    if (source.unavailableDates.includes(dateKey) || checkLunchSlot(startTime)) {
      return 'UNAVAILABLE';
    }

    return source.mySlotKeys.has(createSlotKey(dateKey, startTime)) ? 'APPLIED' : 'AVAILABLE';
  };

  // 한 칸의 지금 상태. 사용자가 바꾼 값이 있으면 그것을, 없으면 원래 상태를 쓴다.
  const getSlotEdit = (dateKey: string, startTime: string): SlotEdit => {
    // 수정·신청 화면에서 이미 지났거나 마감이 지난 칸은 고칠 수 없으니 신청 불가로 막는다.
    if (isEditable && getSlotStartDate(dateKey, startTime) < source.editableFrom) {
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

  // 바꾼 뒤 내 근무가 되는 칸 전체 (보고 있지 않은 주 포함). 신청을 통째로 저장할 때 쓴다.
  const getWorkingSlots = () => {
    const originalSlots = [...source.mySlotKeys].map((key) => ({
      date: key.slice(0, 10),
      startTime: key.slice(11),
    }));
    const changedKeys = new Set(
      changedSlots.map(({ date, startTime }) => createSlotKey(date, startTime)),
    );

    return [
      ...originalSlots.filter(
        ({ date, startTime }) => !changedKeys.has(createSlotKey(date, startTime)),
      ),
      ...changedSlots.filter(({ status }) => WORKING_STATUSES.includes(status)),
    ];
  };

  const dateKeys = dates.map(formatDateKey);

  // 보고 있는 주의 근무 칸 수. 주 최대 시간을 채우면 빈 칸을 더 누를 수 없다.
  const weekWorkingSlotCount = dateKeys
    .flatMap((dateKey) => SLOT_START_TIMES.map((startTime) => getSlotEdit(dateKey, startTime)))
    .filter(({ status }) => WORKING_STATUSES.includes(status)).length;
  const weekHours = (weekWorkingSlotCount * SLOT_MINUTES) / MINUTES_PER_HOUR;
  const isWeekFull = weekWorkingSlotCount >= maxSlotsPerWeek;

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
        workers: source.workersBySlot[key] ?? [],
        maxCount: source.maxConcurrentWorkers,
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

  return {
    days,
    cells,
    changedSlots,
    resetEdits,
    weekHours,
    isWeekFull,
    getShortShiftDates,
    getWorkingSlots,
  };
};
