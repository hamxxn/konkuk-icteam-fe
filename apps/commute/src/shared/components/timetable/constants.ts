import { SLOT_TIMES } from '@/shared/config/slot';

import type { SlotStatus, TimeRange } from './types';
import { convertTimeToMinutes } from './utils';

// 운영 종료 시각. 이 시각부터 시작하는 칸은 표에 그리지 않는다.
export const CLOSING_TIME = '17:30';

// 점심시간. 이 시간 칸은 언제나 신청할 수 없다.
export const LUNCH_BREAK: TimeRange = { start: '11:30', end: '13:00' };

// 표에 그릴 칸 시작 시각 목록 ('09:00', '09:30', ..., '17:00')
// 칸 뼈대는 공용 SLOT_TIMES를 따르고, 운영 종료 뒤 칸만 뺀다.
export const SLOT_START_TIMES = SLOT_TIMES.map(({ start }) => start).filter(
  (start) => convertTimeToMinutes(start) < convertTimeToMinutes(CLOSING_TIME),
);

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
