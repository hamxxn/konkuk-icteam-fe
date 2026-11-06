import type { TimeString } from '@/app/(student)/_apis/common';
import type { OnDutyWorker } from './getWorkersByPeriod';

/**
 * 업무 시작 시각으로 고를 수 있는 시각을 얻습니다. 그 시간대에 누군가 근무하는 칸의 시작 시각입니다.
 * @param workers 그 시간대 근무자
 * @returns 시작 시각 목록 (HH:mm, 이른 순)
 * @example getTaskStartOptions(workers); // ['13:00', '13:30', '14:00', ...]
 */
export const getTaskStartOptions = (workers: OnDutyWorker[]) =>
  [...new Set(workers.flatMap(({ workSlots }) => workSlots.map(({ start }) => start)))].sort();

/**
 * 업무 시작 시각에 근무하는 사람을 얻습니다. 업무는 이 사람들에게만 맡길 수 있습니다.
 * @param workers 그 시간대 근무자
 * @param start 업무 시작 시각 (HH:mm)
 * @returns 그 시각 칸에 근무하는 사람
 * @example getWorkersAt(workers, '14:00').map(({ userName }) => userName); // ['홍길동', '정하준']
 */
export const getWorkersAt = (workers: OnDutyWorker[], start: TimeString) =>
  workers.filter(({ workSlots }) => workSlots.some((slot) => slot.start === start));
