import { describe, expect, it } from 'vitest';
import { parseStudentTab } from './studentTab';

describe('parseStudentTab', () => {
  it('ALL이면 전체 탭, 그 밖의 값은 월별 탭이다', () => {
    expect(parseStudentTab('ALL')).toBe('ALL');
    expect(parseStudentTab('MONTHLY')).toBe('MONTHLY');
    expect(parseStudentTab(undefined)).toBe('MONTHLY');
    expect(parseStudentTab(['ALL'])).toBe('MONTHLY');
  });
});
