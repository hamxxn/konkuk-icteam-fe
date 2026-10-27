import { WORKERS_MOCK } from '@/app/(admin)/_apis/mock/workers';
import { MY_USER_ID } from '@/app/(student)/_apis/mock/me';
import type { LoginUser } from '../auth';

// 로그인할 수 있는 계정 (서버가 갖고 있는 정보). 비밀번호는 목업 전용 값이다
type AccountMock = {
  email: string;
  password: string;
  user: LoginUser;
  // 관리자가 가입을 승인했는지. 승인 전에는 로그인할 수 없다
  isApproved: boolean;
};

// 근로학생 화면 목업의 본인(홍길동)과 같은 사람이다. 관리자 화면에서 이름을 바꾸면 그대로 따라간다
const getStudentAccountMock = (): AccountMock | undefined => {
  const worker = WORKERS_MOCK.find(({ userId }) => userId === MY_USER_ID);
  if (!worker?.email) return undefined;

  return {
    email: worker.email,
    password: 'password1234',
    user: { userId: worker.userId, name: worker.name, role: 'STUDENT' },
    isApproved: true,
  };
};

// 관리자 계정. 관리자는 근로장학생 목록에 없다
const ADMIN_ACCOUNT_MOCK: AccountMock = {
  email: 'admin@konkuk.ac.kr',
  password: 'password1234',
  user: { userId: 100, name: '김정보', role: 'ADMIN' },
  isApproved: true,
};

// 회원가입은 했지만 관리자가 아직 승인하지 않은 근로장학생 계정
const PENDING_ACCOUNT_MOCK: AccountMock = {
  email: 'newbie@konkuk.ac.kr',
  password: 'password1234',
  user: { userId: 200, name: '박새봄', role: 'STUDENT' },
  isApproved: false,
};

/**
 * 메일로 로그인할 수 있는 계정을 찾습니다.
 * @param email 학교 메일
 * @returns 그 메일의 계정. 없으면 undefined
 * @example findAccountMock('gildong@konkuk.ac.kr')?.user.role; // 'STUDENT'
 */
export const findAccountMock = (email: string) =>
  [getStudentAccountMock(), ADMIN_ACCOUNT_MOCK, PENDING_ACCOUNT_MOCK].find(
    (account) => account?.email === email,
  );
