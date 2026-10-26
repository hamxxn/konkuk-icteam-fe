import { SLOT_TIMES } from '@/shared/config/slot';

import type { SlotStatus } from './types';

// 표에 그릴 칸 시작 시각 목록 ('09:00', '10:00', ..., '17:00'). 관리자 시간표와 같은 한 시간 칸이다
export const SLOT_START_TIMES = SLOT_TIMES.map(({ start }) => start);

export const SLOT_STATUS_CLASS_NAME: Record<SlotStatus, string> = {
  AVAILABLE: 'border border-gray-400/30 bg-black-1',
  UNAVAILABLE: 'border border-gray-400/30 bg-gray-50',
  PENDING_ADD: 'border-2 border-blue bg-black-1',
  PENDING_DELETE: 'border-2 border-red bg-black-1',
  APPLIED: 'border border-blue bg-blue',
};

// edit 모드에서 슬롯을 눌렀을 때 바뀌는 상태. 없는 상태(신청 불가)는 누를 수 없다.
export const EDIT_NEXT_STATUS: Partial<Record<SlotStatus, SlotStatus>> = {
  AVAILABLE: 'PENDING_ADD',
  PENDING_ADD: 'AVAILABLE',
  APPLIED: 'PENDING_DELETE',
  PENDING_DELETE: 'APPLIED',
};

// apply 모드에서 슬롯을 눌렀을 때 바뀌는 상태. 신청은 예정 단계 없이 바로 신청·취소된다.
export const APPLY_NEXT_STATUS: Partial<Record<SlotStatus, SlotStatus>> = {
  AVAILABLE: 'APPLIED',
  APPLIED: 'AVAILABLE',
};

export const WEEKDAY_LABELS = ['월', '화', '수', '목', '금'];
