import { describe, expect, it } from 'vitest';
import { checkHoliday, checkWeekend, getMonthDates } from './calendar';

describe('checkWeekend', () => {
  it('토·일만 주말로 본다', () => {
    expect(checkWeekend(new Date(2026, 9, 24))).toBe(true);
    expect(checkWeekend(new Date(2026, 9, 25))).toBe(true);
    expect(checkWeekend(new Date(2026, 9, 26))).toBe(false);
  });
});

describe('checkHoliday', () => {
  it('공휴일 목록에 있는 날만 공휴일로 본다', () => {
    expect(checkHoliday('2026-10-09')).toBe(true);
    expect(checkHoliday('2026-10-27')).toBe(false);
  });
});

describe('getMonthDates', () => {
  it('1일부터 말일까지 날짜를 만든다', () => {
    const dates = getMonthDates(new Date(2026, 1, 10));

    expect(dates).toHaveLength(28);
    expect(dates[0]).toBe('2026-02-01');
    expect(dates.at(-1)).toBe('2026-02-28');
  });
});
