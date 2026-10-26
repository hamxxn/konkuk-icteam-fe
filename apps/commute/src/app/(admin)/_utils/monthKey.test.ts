import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMonthKey, getCurrentMonthKey, parseMonthKey, shiftMonthKey } from './monthKey';

describe('monthKey', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('연·월로 YYYY-MM 키를 만들고 다시 나눈다', () => {
    expect(createMonthKey(2026, 3)).toBe('2026-03');
    expect(parseMonthKey('2026-03')).toEqual({ year: 2026, month: 3 });
  });

  it('이번 달 키를 얻는다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 27));

    expect(getCurrentMonthKey()).toBe('2026-10');
  });

  it('달을 옮길 때 연도를 넘긴다', () => {
    expect(shiftMonthKey('2026-12', 1)).toBe('2027-01');
    expect(shiftMonthKey('2026-01', -1)).toBe('2025-12');
    expect(shiftMonthKey('2026-10', 0)).toBe('2026-10');
  });
});
