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

    expect(workers.MORNING).toEqual([
      { userId: 1, userName: '홍길동' },
      { userId: 2, userName: '김민지' },
    ]);
    expect(workers.AFTERNOON).toEqual([{ userId: 3, userName: '이서준' }]);
  });

  it('근무자가 없으면 빈 배열이다', () => {
    expect(getWorkersByPeriod([])).toEqual({ MORNING: [], AFTERNOON: [] });
  });
});
