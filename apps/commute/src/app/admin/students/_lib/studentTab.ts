// 근로장학생 보기 탭. 주소의 ?tab= 값이고, 월별 탭이 기본이다
export type StudentTab = 'MONTHLY' | 'ALL';

/**
 * 주소의 tab 값을 근로장학생 탭으로 바꿉니다. 모르는 값이면 월별 탭입니다.
 * @param value 주소의 tab 값
 * @returns 근로장학생 탭
 * @example parseStudentTab('ALL'); // 'ALL'
 */
export const parseStudentTab = (value: unknown): StudentTab =>
  value === 'ALL' ? 'ALL' : 'MONTHLY';
