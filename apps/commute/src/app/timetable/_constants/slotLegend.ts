import type { SlotStatus } from '@/shared/components/timetable/types';

export type SlotLegendItem = { status: SlotStatus; label: string };

// 수정 요청 화면: 관리자 승인 전이라 추가·삭제가 '예정'으로 보인다
export const EDIT_LEGEND_ITEMS: SlotLegendItem[] = [
  { status: 'APPLIED', label: '신청 완료' },
  { status: 'PENDING_ADD', label: '추가 예정' },
  { status: 'PENDING_DELETE', label: '삭제 예정' },
  { status: 'UNAVAILABLE', label: '신청 불가' },
];

// 신청 화면: 예정 상태 없이 바로 신청·취소된다
export const APPLY_LEGEND_ITEMS: SlotLegendItem[] = [
  { status: 'APPLIED', label: '신청' },
  { status: 'AVAILABLE', label: '신청 가능' },
  { status: 'UNAVAILABLE', label: '신청 불가' },
];
