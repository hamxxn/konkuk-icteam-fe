import { describe, expect, it } from 'vitest';
import { mergeContinuousSlots } from './timeRange';

describe('mergeContinuousSlots', () => {
  it('이어진 칸은 한 구간으로 묶고 사이가 비면 나눈다', () => {
    expect(
      mergeContinuousSlots([
        { start: '09:00', end: '09:30' },
        { start: '09:30', end: '10:00' },
        { start: '13:00', end: '13:30' },
      ]),
    ).toEqual([
      { start: '09:00', end: '10:00' },
      { start: '13:00', end: '13:30' },
    ]);
  });

  it('칸이 없으면 빈 배열이다', () => {
    expect(mergeContinuousSlots([])).toEqual([]);
  });
});
