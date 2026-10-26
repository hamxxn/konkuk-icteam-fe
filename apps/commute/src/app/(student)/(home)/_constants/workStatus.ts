import type { TodoPeriod } from '@/shared/apis/todos';
import type { WorkStatusCode } from '@/shared/apis/workShifts';
import type { ChipTone } from '@/shared/ui';

// 근무 상태별 상태 칩 색
export const WORK_STATUS_TONE: Record<WorkStatusCode, ChipTone> = {
  WK01: 'gray',
  WK02: 'blue',
  WK03: 'green',
  WK04: 'red',
};

// 근무 상태별 상태 칩 문구
export const WORK_STATUS_LABEL: Record<WorkStatusCode, string> = {
  WK01: '예정',
  WK02: '근무중',
  WK03: '근무 완료',
  WK04: '결근',
};

// 오전·오후 근무 이름
export const WORK_SHIFT_LABEL: Record<TodoPeriod, string> = {
  MORNING: '오전 근무',
  AFTERNOON: '오후 근무',
};
