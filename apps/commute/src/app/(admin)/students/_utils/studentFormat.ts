import { EMPTY_STUDENT_TEXT, NO_GRADE_LABEL } from '../_constants/student';

/**
 * 학년을 "N학년"으로 바꿉니다. 비어 있으면 "-"입니다.
 * @param grade 학년 (없으면 null)
 * @returns 화면에 보여 줄 학년
 * @example formatGrade(3); // '3학년'
 */
export const formatGrade = (grade: number | null) =>
  grade === null ? EMPTY_STUDENT_TEXT : `${grade}학년`;

/**
 * 드롭다운에서 고른 학년 글자를 숫자로 바꿉니다.
 * @param label 드롭다운 글자 ("선택 안 함" 또는 "N학년")
 * @returns 학년 숫자. "선택 안 함"이면 null
 * @example parseGradeLabel('2학년'); // 2
 */
export const parseGradeLabel = (label: string) =>
  label === NO_GRADE_LABEL ? null : Number(label.replace('학년', ''));

/**
 * 분을 시간으로 바꿉니다. 30분 단위 근무라 나누어떨어지면 정수, 아니면 소수 첫째 자리까지 보여 줍니다.
 * @param minutes 분
 * @returns 시간 문자열
 * @example formatMinutesToHours(270); // '4.5'
 */
export const formatMinutesToHours = (minutes: number) => {
  const hours = minutes / 60;

  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
};
