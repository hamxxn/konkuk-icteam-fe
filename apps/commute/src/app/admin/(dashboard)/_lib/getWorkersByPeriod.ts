import type { TodoPeriod } from '../../_apis/todos';
import type { WorkScheduleSlot } from '../../_apis/workSchedules';
import { PERIODS } from '../../_constants/period';
import type { OnDutyWorker } from '../_components/AssignTaskList';

/**
 * 근무 칸에서 시간대별로 근무하는 근로학생을 한 번씩만 모읍니다. 시간대는 PERIODS 기준(12시 전 시작이면 오전)입니다.
 * @param slots 하루치 근무 칸
 * @returns 오전·오후 근무자 목록
 * @example getWorkersByPeriod(slots).MORNING; // [{ userId: 2, userName: '김민지' }]
 */
export const getWorkersByPeriod = (
  slots: WorkScheduleSlot[],
): Record<TodoPeriod, OnDutyWorker[]> => {
  const collectWorkers = (checkHour: (hour: number) => boolean) =>
    slots
      .filter(({ start }) => checkHour(Number(start.split(':')[0])))
      .flatMap(({ users }) => users)
      .map(({ userId, userName }) => ({ userId, userName }))
      .filter(
        (user, index, users) => users.findIndex(({ userId }) => userId === user.userId) === index,
      );

  return Object.fromEntries(
    PERIODS.map(({ period, checkHour }) => [period, collectWorkers(checkHour)]),
  ) as Record<TodoPeriod, OnDutyWorker[]>;
};
