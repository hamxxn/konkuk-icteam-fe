import type { ChipTone } from '@/shared/ui';
import { WorkStatus } from '../_types';

// 근무 상태별 상태 칩 색
export const WORK_STATUS_TONE: Record<WorkStatus, ChipTone> = {
  [WorkStatus.SCHEDULED]: 'gray',
  [WorkStatus.WORKING]: 'blue',
  [WorkStatus.COMPLETED]: 'green',
  [WorkStatus.ABSENT]: 'red',
};

// 근무 상태별 상태 칩 문구
export const WORK_STATUS_LABEL: Record<WorkStatus, string> = {
  [WorkStatus.SCHEDULED]: '예정',
  [WorkStatus.WORKING]: '근무중',
  [WorkStatus.COMPLETED]: '근무 완료',
  [WorkStatus.ABSENT]: '결근',
};
