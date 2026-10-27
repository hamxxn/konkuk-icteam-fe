import { describe, expect, it } from 'vitest';
import { getNonWorkingDates } from './getNonWorkingDates';

describe('getNonWorkingDates', () => {
  it('주말과 공휴일을 날짜순으로 모은다', () => {
    const dates = getNonWorkingDates('2026-10');

    // 10.03(토, 개천절)·10.04(일)·10.09(금, 한글날)
    expect(dates).toContain('2026-10-03');
    expect(dates).toContain('2026-10-04');
    expect(dates).toContain('2026-10-09');
    expect(dates).toEqual([...dates].sort());
  });

  it('평일은 넣지 않는다', () => {
    expect(getNonWorkingDates('2026-10')).not.toContain('2026-10-27');
  });
});
