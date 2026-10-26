import { describe, expect, it } from 'vitest';
import { parseStatusFilter } from './statusFilter';

describe('parseStatusFilter', () => {
  it('알맞은 상태 코드는 그대로, 모르는 값은 전체로 바꾼다', () => {
    expect(parseStatusFilter('CS01')).toBe('CS01');
    expect(parseStatusFilter('CS03')).toBe('CS03');
    expect(parseStatusFilter('CS99')).toBe('ALL');
    expect(parseStatusFilter(undefined)).toBe('ALL');
  });
});
