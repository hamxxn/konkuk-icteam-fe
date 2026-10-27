import { describe, expect, it } from 'vitest';
import { formatWeekRange, getWeekDays, getWeekStartKey, shiftWeek } from './weekKey';

describe('weekKey', () => {
  it('날짜가 속한 주의 월요일을 얻는다. 일요일은 지난 월요일 주다', () => {
    expect(getWeekStartKey(new Date(2026, 9, 24))).toBe('2026-10-19');
    expect(getWeekStartKey(new Date(2026, 9, 19))).toBe('2026-10-19');
    expect(getWeekStartKey(new Date(2026, 9, 25))).toBe('2026-10-19');
  });

  it('주를 앞뒤로 옮기고 달을 넘긴다', () => {
    expect(shiftWeek('2026-10-26', 1)).toBe('2026-11-02');
    expect(shiftWeek('2026-10-19', -1)).toBe('2026-10-12');
  });

  it('월~금 다섯 날과 표시용 글자를 만든다', () => {
    const days = getWeekDays('2026-10-26');

    expect(days.map(({ dateKey }) => dateKey)).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
    ]);
    expect(days[0]).toEqual({ dateKey: '2026-10-26', dateLabel: '10.26', weekday: '월' });
  });

  it('주를 MM.DD - MM.DD로 보여 준다', () => {
    expect(formatWeekRange('2026-10-19')).toBe('10.19 - 10.23');
  });
});
