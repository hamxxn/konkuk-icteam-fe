import type { TodoPeriod } from '../../_apis/todos';
import type { WorkScheduleSlot } from '../../_apis/workSchedules';
import { removeDuplicatesBy } from '@/shared/utils/array';
import type { TimeRange } from '@/shared/utils/timeRange';
import { PERIODS } from '../../_constants/period';

// 그 시간대에 근무하는 근로학생. 업무는 이 사람들에게만, 근무하는 칸 안의 시간으로만 맡길 수 있다
export type OnDutyWorker = {
  userId: number;
  userName: string;
  // 그 시간대에 근무하는 칸. 시작 시각 순이다
  workSlots: TimeRange[];
};

/**
 * 근무 칸에서 시간대별로 근무하는 근로학생을 한 번씩만 모읍니다. 시간대는 PERIODS 기준(12시 전 시작이면 오전)이고,
 * 사람 순서는 오전·오후를 합친 그날 근무 칸이 많은 순이고, 같으면 그 시간대에 먼저 근무를 시작하는 순서입니다.
 * @param slots 하루치 근무 칸
 * @returns 오전·오후 근무자 목록과 사람마다 근무하는 칸
 * @example getWorkersByPeriod(slots).MORNING[0]; // { userId: 2, userName: '김민지', workSlots: [{ start: '09:00', end: '09:30' }, ...] }
 */
export const getWorkersByPeriod = (
  slots: WorkScheduleSlot[],
): Record<TodoPeriod, OnDutyWorker[]> => {
  // 오전·오후를 합친 사람별 그날 근무 칸 수
  const dailySlotCounts = new Map<number, number>();
  slots.forEach(({ users }) =>
    users.forEach(({ userId }) =>
      dailySlotCounts.set(userId, (dailySlotCounts.get(userId) ?? 0) + 1),
    ),
  );
  const getDailySlotCount = (userId: number) => dailySlotCounts.get(userId) ?? 0;

  const collectWorkers = (checkHour: (hour: number) => boolean) => {
    const periodSlots = slots.filter(({ start }) => checkHour(Number(start.split(':')[0])));

    return removeDuplicatesBy(
      periodSlots.flatMap(({ users }) => users),
      ({ userId }) => userId,
    )
      .map(({ userId, userName }) => ({
        userId,
        userName,
        workSlots: periodSlots
          .filter(({ users }) => users.some((user) => user.userId === userId))
          .map(({ start, end }) => ({ start, end })),
      }))
      .sort((first, second) => getDailySlotCount(second.userId) - getDailySlotCount(first.userId));
  };

  return Object.fromEntries(
    PERIODS.map(({ period, checkHour }) => [period, collectWorkers(checkHour)]),
  ) as Record<TodoPeriod, OnDutyWorker[]>;
};
