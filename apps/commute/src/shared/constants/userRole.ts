// 로그인한 사용자가 근로장학생인지 관리자인지. 서버가 로그인 응답으로 알려 준다
export const USER_ROLE = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
