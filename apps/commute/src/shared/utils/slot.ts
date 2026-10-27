import { LUNCH_BREAK } from '@/shared/config/slot';

/**
 * 칸이 점심시간에 걸리는지 확인합니다.
 * @param start 칸 시작 시각 (HH:mm)
 * @returns 점심시간 칸이면 true
 * @example checkLunchSlot('12:00'); // true
 */
export const checkLunchSlot = (start: string) =>
  start >= LUNCH_BREAK.start && start < LUNCH_BREAK.end;
