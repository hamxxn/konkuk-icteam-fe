import { loginMock } from './mock/auth';

// 로그인한 사용자가 근로장학생인지 관리자인지. 서버가 로그인 응답으로 알려 준다
export type UserRole = 'STUDENT' | 'ADMIN';

export type LoginRequest = {
  // 학교 메일 (@konkuk.ac.kr)
  email: string;
  password: string;
};

// 로그인한 사용자
export type LoginUser = {
  userId: number;
  name: string;
  role: UserRole;
};

// 로그인에 성공하면 서버가 보내는 본문 (200)
export type LoginResponse = LoginUser;

// 로그인에 실패한 까닭
// - INVALID_CREDENTIALS: 메일이 없거나 비밀번호가 틀림. 어느 쪽인지 알려 주지 않는다
// - PENDING_APPROVAL: 메일·비밀번호는 맞지만 관리자가 아직 가입을 승인하지 않음
export type LoginErrorCode = 'INVALID_CREDENTIALS' | 'PENDING_APPROVAL';

// 로그인에 실패하면 서버가 보내는 본문 (401·403)
export type LoginErrorResponse = {
  code: LoginErrorCode;
};

// 화면이 받는 로그인 결과. 성공·실패 응답을 한 모양으로 묶는다
export type LoginResult =
  { isSuccess: true; user: LoginUser } | { isSuccess: false; errorCode: LoginErrorCode };

/**
 * POST /auth/login
 * 학교 메일과 비밀번호로 로그인한다. 성공하면 사용자를, 실패하면 그 까닭을 돌려준다
 */
export const login = (request: LoginRequest): LoginResult => {
  const response = loginMock(request);

  return 'code' in response
    ? { isSuccess: false, errorCode: response.code }
    : { isSuccess: true, user: response };
};
