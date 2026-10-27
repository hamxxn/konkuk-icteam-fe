import { describe, expect, it } from 'vitest';
import { convertMinutesToTime, convertTimeToMinutes } from './time';

describe('convertTimeToMinutes', () => {
  it('HH:mm을 자정부터 지난 분으로 바꾼다', () => {
    expect(convertTimeToMinutes('09:30')).toBe(570);
    expect(convertTimeToMinutes('00:00')).toBe(0);
  });
});

describe('convertMinutesToTime', () => {
  it('분을 두 자리 HH:mm으로 바꾼다', () => {
    expect(convertMinutesToTime(570)).toBe('09:30');
    expect(convertMinutesToTime(1080)).toBe('18:00');
  });

  it('convertTimeToMinutes와 서로 되돌린다', () => {
    expect(convertMinutesToTime(convertTimeToMinutes('13:00'))).toBe('13:00');
  });
});
