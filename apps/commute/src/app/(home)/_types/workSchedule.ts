import type { HomeTodaySchedule } from './api';

// 서버가 내려주는 근무 상태 코드
export enum WorkStatus {
  SCHEDULED = 'WK01',
  WORKING = 'WK02',
  COMPLETED = 'WK03',
  ABSENT = 'WK04',
}

// 근무 일정 응답에 지금 출근할 수 있는지만 붙인 것. 카드가 canClockIn을 보고 출근 버튼을 그린다
export type WorkSchedule = HomeTodaySchedule & {
  canClockIn: boolean;
};
