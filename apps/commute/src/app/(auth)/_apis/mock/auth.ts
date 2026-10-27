import { WORKERS_MOCK } from '@/app/(admin)/_apis/mock/workers';
import { MY_USER_ID } from '@/app/(student)/_apis/mock/me';
import type { LoginErrorResponse, LoginRequest, LoginResponse } from '../auth';

// 목업 계정은 모두 같은 비밀번호를 쓴다 (목업 전용 값)
const PASSWORD_MOCK = 'password1234';

// 로그인할 수 있는 계정 (서버가 갖고 있는 정보)
type AccountMock = {
  email: string;
  password: string;
  user: LoginResponse;
  // 관리자가 가입을 승인했는지. 승인 전에는 로그인할 수 없다
  isApproved: boolean;
};

// 근로학생 화면 목업의 본인(홍길동)과 같은 사람이다. 관리자 화면에서 이름을 바꾸면 그대로 따라간다
const getStudentAccountMock = (): AccountMock | undefined => {
  const worker = WORKERS_MOCK.find(({ userId }) => userId === MY_USER_ID);
  if (!worker?.email) return undefined;

  return {
    email: worker.email,
    password: PASSWORD_MOCK,
    user: { userId: worker.userId, name: worker.name, role: 'STUDENT' },
    isApproved: true,
  };
};

// 관리자 계정. 관리자는 근로장학생 목록에 없다
const ADMIN_ACCOUNT_MOCK: AccountMock = {
  email: 'admin@konkuk.ac.kr',
  password: PASSWORD_MOCK,
  user: { userId: 100, name: '김정보', role: 'ADMIN' },
  isApproved: true,
};

// 회원가입은 했지만 관리자가 아직 승인하지 않은 근로장학생 계정
const PENDING_ACCOUNT_MOCK: AccountMock = {
  email: 'newbie@konkuk.ac.kr',
  password: PASSWORD_MOCK,
  user: { userId: 200, name: '박새봄', role: 'STUDENT' },
  isApproved: false,
};

const findAccountMock = (email: string) =>
  [getStudentAccountMock(), ADMIN_ACCOUNT_MOCK, PENDING_ACCOUNT_MOCK].find(
    (account) => account?.email === email,
  );

/**
 * 서버의 로그인 판정을 흉내 냅니다. 승인 대기는 비밀번호까지 맞을 때만 알려 줍니다.
 * @param request 로그인 요청
 * @param request.email 학교 메일 (소문자)
 * @param request.password 비밀번호
 * @returns 성공하면 로그인한 사용자, 실패하면 오류 코드 (서버가 보낼 JSON 모양)
 * @example loginMock({ email: 'newbie@konkuk.ac.kr', password: 'password1234' }); // { code: 'PENDING_APPROVAL' }
 */
export const loginMock = ({
  email,
  password,
}: LoginRequest): LoginResponse | LoginErrorResponse => {
  const account = findAccountMock(email);
  if (!account || account.password !== password) return { code: 'INVALID_CREDENTIALS' };
  if (!account.isApproved) return { code: 'PENDING_APPROVAL' };

  return account.user;
};
