import { describe, expect, it } from 'vitest';
import { createDefaultSettings } from './createDefaultSettings';

describe('createDefaultSettings', () => {
  it('신청은 전달 20일 09:00부터 25일 18:00까지 받는다', () => {
    const settings = createDefaultSettings('2026-11');

    expect(settings.applyStartDate).toEqual(new Date(2026, 9, 20, 9));
    expect(settings.applyEndDate).toEqual(new Date(2026, 9, 25, 18));
    expect(settings.unavailableDates).toEqual([]);
  });

  it('1월은 지난해 12월에 신청을 받는다', () => {
    expect(createDefaultSettings('2027-01').applyStartDate).toEqual(new Date(2026, 11, 20, 9));
  });
});
