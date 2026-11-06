import { describe, expect, it } from 'vitest';
import { getTaskStartOptions, getWorkersAt } from './taskTime';

const WORKERS = [
  {
    userId: 1,
    userName: '홍길동',
    workSlots: [
      { start: '14:00', end: '14:30' },
      { start: '14:30', end: '15:00' },
    ],
  },
  {
    userId: 2,
    userName: '김민지',
    workSlots: [
      { start: '13:00', end: '13:30' },
      { start: '14:00', end: '14:30' },
    ],
  },
];

describe('getTaskStartOptions', () => {
  it('누군가 근무하는 칸의 시작 시각을 겹치지 않게 이른 순으로 모은다', () => {
    expect(getTaskStartOptions(WORKERS)).toEqual(['13:00', '14:00', '14:30']);
  });
});

describe('getWorkersAt', () => {
  it('그 시각 칸에 근무하는 사람만 고른다', () => {
    expect(getWorkersAt(WORKERS, '14:00').map(({ userId }) => userId)).toEqual([1, 2]);
    expect(getWorkersAt(WORKERS, '14:30').map(({ userId }) => userId)).toEqual([1]);
  });
});
