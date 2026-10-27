import { formatNumber } from '@konkuk-icteam-fe/design-system/date';

// 근무 칸은 30분 단위이고 09:00 ~ 18:00 까지 하루 18칸이다 (관리자·근로학생 화면 공통)
const FIRST_SLOT_HOUR = 9;
const LAST_SLOT_HOUR = 18;

export const SLOT_MINUTES = 30;

export const SLOTS_PER_DAY = ((LAST_SLOT_HOUR - FIRST_SLOT_HOUR) * 60) / SLOT_MINUTES;

const formatSlotTime = (minutesFromMidnight: number) =>
  `${formatNumber(Math.floor(minutesFromMidnight / 60))}:${formatNumber(minutesFromMidnight % 60)}`;

// 하루 18칸의 시간 뼈대. 서버가 일부 칸만 내려주더라도 표 모양이 흔들리지 않도록 여기서 기준을 잡는다
export const SLOT_TIMES = Array.from({ length: SLOTS_PER_DAY }, (_, index) => {
  const startMinutes = FIRST_SLOT_HOUR * 60 + index * SLOT_MINUTES;

  return { start: formatSlotTime(startMinutes), end: formatSlotTime(startMinutes + SLOT_MINUTES) };
});

// 점심시간. 이 시간 칸은 언제나 근무할 수 없다 (시작 포함, 끝 미포함)
export const LUNCH_BREAK = { start: '11:30', end: '13:00' } as const;

/**
 * 칸이 점심시간에 걸리는지 확인합니다.
 * @param start 칸 시작 시각 (HH:mm)
 * @returns 점심시간 칸이면 true
 * @example checkLunchSlot('12:00'); // true
 */
export const checkLunchSlot = (start: string) =>
  start >= LUNCH_BREAK.start && start < LUNCH_BREAK.end;
