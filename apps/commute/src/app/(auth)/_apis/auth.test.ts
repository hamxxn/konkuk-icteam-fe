import { describe, expect, it } from 'vitest';
import { login } from './auth';

describe('login', () => {
  it('근로장학생 계정으로 로그인하면 역할이 근로장학생이다', () => {
    expect(login({ email: 'gildong@konkuk.ac.kr', password: 'password1234' })).toEqual({
      isSuccess: true,
      user: { userId: 1, name: '홍길동', role: 'STUDENT' },
    });
  });

  it('관리자 계정으로 로그인하면 역할이 관리자다', () => {
    expect(login({ email: 'admin@konkuk.ac.kr', password: 'password1234' })).toEqual({
      isSuccess: true,
      user: { userId: 100, name: '김정보', role: 'ADMIN' },
    });
  });

  it('없는 메일과 틀린 비밀번호는 구분하지 않고 같은 로그인 실패다', () => {
    const invalidCredentials = { isSuccess: false, errorCode: 'INVALID_CREDENTIALS' };

    expect(login({ email: 'nobody@konkuk.ac.kr', password: 'password1234' })).toEqual(
      invalidCredentials,
    );
    expect(login({ email: 'gildong@konkuk.ac.kr', password: 'wrong-password' })).toEqual(
      invalidCredentials,
    );
  });

  it('승인 대기 계정은 비밀번호가 맞아도 로그인되지 않는다', () => {
    expect(login({ email: 'newbie@konkuk.ac.kr', password: 'password1234' })).toEqual({
      isSuccess: false,
      errorCode: 'PENDING_APPROVAL',
    });
  });

  it('승인 대기 계정이라도 비밀번호가 틀리면 승인 대기인지 알려 주지 않는다', () => {
    expect(login({ email: 'newbie@konkuk.ac.kr', password: 'wrong-password' })).toEqual({
      isSuccess: false,
      errorCode: 'INVALID_CREDENTIALS',
    });
  });
});
