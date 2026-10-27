import { describe, expect, it } from 'vitest';
import { createDateKeepingTime, createDateWithTime, getTimeOfDay } from './applyDateTime';

describe('applyDateTime', () => {
  it('시각만 HH:mm으로 얻는다', () => {
    expect(getTimeOfDay(new Date(2026, 9, 20, 9, 5))).toBe('09:05');
  });

  it('날짜는 두고 시각만 바꾼다', () => {
    expect(createDateWithTime(new Date(2026, 9, 20, 9), '18:30')).toEqual(
      new Date(2026, 9, 20, 18, 30),
    );
  });

  it('비어 있는 시각은 0시로 본다', () => {
    expect(createDateWithTime(new Date(2026, 9, 20, 9), '')).toEqual(new Date(2026, 9, 20, 0, 0));
  });

  it('시각은 두고 날짜만 바꾼다', () => {
    expect(createDateKeepingTime('2026-10-22', new Date(2026, 9, 20, 9, 15))).toEqual(
      new Date(2026, 9, 22, 9, 15),
    );
  });
});
