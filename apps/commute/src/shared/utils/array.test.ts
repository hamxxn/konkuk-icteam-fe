import { describe, expect, it } from 'vitest';
import { removeDuplicatesBy } from './array';

describe('removeDuplicatesBy', () => {
  it('같은 값을 가진 항목은 처음 것만 남기고 순서는 지킨다', () => {
    const items = [
      { userId: 2, name: '김민지' },
      { userId: 1, name: '홍길동' },
      { userId: 2, name: '김민지(2)' },
    ];

    expect(removeDuplicatesBy(items, ({ userId }) => userId)).toEqual([
      { userId: 2, name: '김민지' },
      { userId: 1, name: '홍길동' },
    ]);
  });
});
