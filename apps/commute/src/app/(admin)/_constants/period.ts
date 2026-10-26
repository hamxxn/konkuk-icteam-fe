import type { TodoPeriod } from '../_apis/todos';

const NOON_HOUR = 12;

// 근무·업무 시간대. 12시 전에 시작하는 근무는 오전, 나머지는 오후
export const PERIODS: {
  period: TodoPeriod;
  label: string;
  checkHour: (hour: number) => boolean;
}[] = [
  { period: 'MORNING', label: '오전', checkHour: (hour) => hour < NOON_HOUR },
  { period: 'AFTERNOON', label: '오후', checkHour: (hour) => hour >= NOON_HOUR },
];
