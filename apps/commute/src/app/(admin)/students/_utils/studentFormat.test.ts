import { describe, expect, it } from 'vitest';
import { NO_GRADE_LABEL } from '../_constants/student';
import { formatGrade, formatMinutesToHours, parseGradeLabel } from './studentFormat';

describe('studentFormat', () => {
  it('학년을 글자로 바꾸고, 없으면 -로 채운다', () => {
    expect(formatGrade(3)).toBe('3학년');
    expect(formatGrade(null)).toBe('-');
  });

  it('드롭다운 글자를 학년 숫자로 바꾼다', () => {
    expect(parseGradeLabel('2학년')).toBe(2);
    expect(parseGradeLabel(NO_GRADE_LABEL)).toBeNull();
  });

  it('분을 시간으로 바꾸고, 나누어떨어지지 않으면 소수 첫째 자리까지 보여 준다', () => {
    expect(formatMinutesToHours(240)).toBe('4');
    expect(formatMinutesToHours(270)).toBe('4.5');
    expect(formatMinutesToHours(250)).toBe('4.2');
  });
});
