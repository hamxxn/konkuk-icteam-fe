import type { WorkShift } from '@/app/(student)/_apis/workShifts';

// 근무 응답에 지금 출근할 수 있는지만 붙인 것. 카드가 canClockIn을 보고 출근 버튼을 그린다
export type WorkShiftView = WorkShift & {
  canClockIn: boolean;
};
