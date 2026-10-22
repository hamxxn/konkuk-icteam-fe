import { TaskPeriod, type HomeTodaySchedule } from '../_types';

/**
 * 근무가 오전·오후 업무 중 어느 쪽을 보는지 정합니다. 정오 전에 시작하면 오전입니다.
 * @param schedule 근무 일정 (start는 HH:MM 또는 HH:MM:SS)
 * @returns 오전이면 TaskPeriod.MORNING, 그 외 TaskPeriod.AFTERNOON
 * @example getTaskPeriod({ ...schedule, start: '13:00' }); // TaskPeriod.AFTERNOON
 */
export const getTaskPeriod = (schedule: Pick<HomeTodaySchedule, 'start'>) =>
  schedule.start < '12:00' ? TaskPeriod.MORNING : TaskPeriod.AFTERNOON;
