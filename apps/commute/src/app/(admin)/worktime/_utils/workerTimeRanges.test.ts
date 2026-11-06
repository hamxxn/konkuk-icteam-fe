import { describe, expect, it } from 'vitest';
import { formatWorkDuration, getWorkerTimeRanges } from './workerTimeRanges';

const createCell = (start: string, end: string, userIds: number[]) => ({
  start,
  end,
  users: userIds.map((userId) => ({ userId })),
});

describe('getWorkerTimeRanges', () => {
  it('이어진 칸은 한 구간으로 묶고 끊기면 나눈다', () => {
    const ranges = getWorkerTimeRanges(
      [
        {
          dateKey: '2026-10-20',
          cells: [
            createCell('09:00', '09:30', [1]),
            createCell('09:30', '10:00', [1, 2]),
            createCell('10:00', '10:30', [2]),
            createCell('10:30', '11:00', [1]),
          ],
        },
        { dateKey: '2026-10-21', cells: [createCell('13:00', '13:30', [2])] },
      ],
      1,
    );

    expect(ranges).toEqual([
      { dateKey: '2026-10-20', start: '09:00', end: '10:00', minutes: 60 },
      { dateKey: '2026-10-20', start: '10:30', end: '11:00', minutes: 30 },
    ]);
  });
});

describe('formatWorkDuration', () => {
  it('시간과 분을 나눠 쓴다', () => {
    expect(formatWorkDuration(60)).toBe('1시간');
    expect(formatWorkDuration(90)).toBe('1시간 30분');
    expect(formatWorkDuration(30)).toBe('30분');
  });
});
