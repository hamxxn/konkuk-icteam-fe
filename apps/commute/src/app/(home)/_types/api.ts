import type { WorkStatus } from './workSchedule';

export type HomeTodaySchedule = {
  scheduleIds: number[];
  label: string;
  start: string;
  end: string;
  workStatusCode: WorkStatus;
  checkedIn: boolean;
  checkInTime: string | null;
};
