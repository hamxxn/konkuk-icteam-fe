import { describe, expect, it } from 'vitest';
import type { WorkScheduleSlot } from '../../_apis/workSchedules';
import { getWorkersByPeriod } from './getWorkersByPeriod';

const createSlot = (start: string, users: [number, string][]): WorkScheduleSlot => ({
  start,
  end: `${Number(start.split(':')[0]) + 1}:00`,
  users: users.map(([userId, userName], index) => ({ scheduleId: index, userId, userName })),
});

describe('getWorkersByPeriod', () => {
  it('12시 전에 시작하는 칸은 오전, 나머지는 오후로 나누고 같은 사람은 한 번만 넣는다', () => {
    const workers = getWorkersByPeriod([
      createSlot('09:00', [[1, '홍길동']]),
      createSlot('10:00', [
        [1, '홍길동'],
        [2, '김민지'],
      ]),
      createSlot('12:00', [[3, '이서준']]),
    ]);

    expect(workers.MORNING.map(({ userId, userName }) => ({ userId, userName }))).toEqual([
      { userId: 1, userName: '홍길동' },
      { userId: 2, userName: '김민지' },
    ]);
    expect(workers.AFTERNOON.map(({ userId }) => userId)).toEqual([3]);
  });

  it('사람마다 그 시간대에 근무하는 칸을 시작 시각 순으로 담는다', () => {
    const workers = getWorkersByPeriod([
      createSlot('09:00', [[1, '홍길동']]),
      createSlot('10:00', [[2, '김민지']]),
      createSlot('11:00', [
        [1, '홍길동'],
        [2, '김민지'],
      ]),
    ]);

    expect(workers.MORNING[0]?.workSlots).toEqual([
      { start: '09:00', end: '10:00' },
      { start: '11:00', end: '12:00' },
    ]);
    expect(workers.MORNING[1]?.workSlots.map(({ start }) => start)).toEqual(['10:00', '11:00']);
  });

  it('오전·오후를 합친 그날 근무 칸이 많은 사람부터 놓고, 같으면 먼저 시작하는 사람이 앞이다', () => {
    const workers = getWorkersByPeriod([
      createSlot('09:00', [
        [1, '홍길동'],
        [2, '김민지'],
      ]),
      createSlot('10:00', [
        [2, '김민지'],
        [3, '이서준'],
      ]),
      createSlot('13:00', [
        [1, '홍길동'],
        [3, '이서준'],
        [4, '박지우'],
      ]),
      createSlot('14:00', [[3, '이서준']]),
    ]);

    // 하루 합계: 이서준 3칸, 홍길동 2칸, 김민지 2칸, 박지우 1칸
    expect(workers.MORNING.map(({ userId }) => userId)).toEqual([3, 1, 2]);
    expect(workers.AFTERNOON.map(({ userId }) => userId)).toEqual([3, 1, 4]);
  });

  it('근무자가 없으면 빈 배열이다', () => {
    expect(getWorkersByPeriod([])).toEqual({ MORNING: [], AFTERNOON: [] });
  });
});
