import { describe, expect, it } from 'vitest';
import { findWorkerByOptionLabel } from './workerSearch';

describe('workerSearch', () => {
  it('목록 글자와 정확히 같을 때만 근로학생을 찾는다', () => {
    expect(findWorkerByOptionLabel('홍길동 (컴퓨터공학부 · 202312345)')?.userId).toBe(1);
    expect(findWorkerByOptionLabel('홍길동')).toBeUndefined();
  });
});
