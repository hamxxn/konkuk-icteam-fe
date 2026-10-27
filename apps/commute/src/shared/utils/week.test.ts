import { describe, expect, it } from 'vitest';
import { getFirstWeekMonday, getMondayOfWeek, getMonthWeekInfo, getWeekdayDates } from './week';

describe('getMondayOfWeek', () => {
  it('일요일은 지난 월요일 주에 넣는다', () => {
    expect(getMondayOfWeek(new Date(2026, 9, 25))).toEqual(new Date(2026, 9, 19));
  });
});

describe('getFirstWeekMonday', () => {
  it('1일이 목요일이면 그 주 월요일이 1주차다', () => {
    expect(getFirstWeekMonday(2026, 10)).toEqual(new Date(2026, 8, 28));
  });
});

describe('getMonthWeekInfo', () => {
  it('두 달에 걸친 주는 목요일이 속한 달로 센다', () => {
    expect(getMonthWeekInfo(new Date(2026, 8, 30))).toEqual({ year: 2026, month: 10, week: 1 });
    expect(getMonthWeekInfo(new Date(2026, 9, 23))).toEqual({ year: 2026, month: 10, week: 4 });
  });
});

describe('getWeekdayDates', () => {
  it('월요일부터 금요일까지 5일을 만든다', () => {
    const dates = getWeekdayDates(new Date(2026, 9, 19));

    expect(dates).toHaveLength(5);
    expect(dates.at(-1)).toEqual(new Date(2026, 9, 23));
  });
});
