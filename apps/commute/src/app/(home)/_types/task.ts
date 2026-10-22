// 근무와 업무는 오전·오후 두 가지로만 나뉜다
export enum TaskPeriod {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
}

// 오전·오후 업무 한 건. 그날 근무하는 사람들이 나눠서 체크한다
export type TaskItem = {
  id: number;
  title: string;
  completed: boolean;
  // 체크한 사람 이름 (완료일 때만)
  completedBy?: string;
  // 체크한 시각 HH:MM (완료일 때만)
  completedTime?: string;
};
