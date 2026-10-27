import { describe, expect, it } from 'vitest';
import {
  addMonths,
  compareISO,
  daysInMonth,
  formatNumber,
  parseISO,
  startOfMonth,
  toISO,
} from './date';

describe('date', () => {
  it('숫자를 두 자리로 맞춘다', () => {
    expect(formatNumber(5)).toBe('05');
    expect(formatNumber(12)).toBe('12');
  });

  it('Date와 YYYY-MM-DD를 로컬 기준으로 서로 바꾼다', () => {
    expect(toISO(new Date(2024, 0, 5))).toBe('2024-01-05');
    expect(parseISO('2024-01-05')).toEqual(new Date(2024, 0, 5));
    expect(toISO(parseISO('2024-12-31'))).toBe('2024-12-31');
  });

  it('달의 1일과 날 수를 얻는다', () => {
    expect(startOfMonth(new Date(2024, 0, 15))).toEqual(new Date(2024, 0, 1));
    expect(daysInMonth(new Date(2024, 1, 1))).toBe(29);
    expect(daysInMonth(new Date(2025, 1, 1))).toBe(28);
  });

  it('달을 옮기면 그 달 1일이 되고 연도를 넘긴다', () => {
    expect(addMonths(new Date(2024, 0, 31), 1)).toEqual(new Date(2024, 1, 1));
    expect(addMonths(new Date(2024, 11, 15), 1)).toEqual(new Date(2025, 0, 1));
    expect(addMonths(new Date(2024, 0, 15), -1)).toEqual(new Date(2023, 11, 1));
  });

  it('YYYY-MM-DD 글자를 날짜순으로 비교한다', () => {
    expect(compareISO('2024-01-15', '2024-01-20')).toBeLessThan(0);
    expect(compareISO('2024-01-20', '2024-01-20')).toBe(0);
    expect(compareISO('2024-02-01', '2024-01-20')).toBeGreaterThan(0);
  });
});
