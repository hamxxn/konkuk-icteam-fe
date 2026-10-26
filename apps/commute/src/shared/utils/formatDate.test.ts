import { describe, expect, it } from 'vitest';
import {
  formatDateRange,
  formatMonthDay,
  formatMonthDayTime,
  formatMonthDayWithWeekday,
  formatYearMonth,
} from './formatDate';

describe('formatDate', () => {
  it('날짜를 MM.DD로, 한 자리 월·일은 0을 붙인다', () => {
    expect(formatMonthDay('2026-03-05')).toBe('03.05');
    expect(formatMonthDay(new Date(2026, 9, 25))).toBe('10.25');
  });

  it('기간을 MM.DD - MM.DD로 보여 준다', () => {
    expect(formatDateRange('2026-10-20', new Date(2026, 9, 25))).toBe('10.20 - 10.25');
  });

  it('요일을 붙인다', () => {
    expect(formatMonthDayWithWeekday('2026-10-24')).toBe('10.24 (토)');
  });

  it('시각을 HH:mm으로 붙인다', () => {
    expect(formatMonthDayTime(new Date(2026, 9, 22, 9, 5))).toBe('10.22 09:05');
  });

  it('연·월을 YYYY.MM으로 보여 준다', () => {
    expect(formatYearMonth('2025-03-01')).toBe('2025.03');
  });
});
