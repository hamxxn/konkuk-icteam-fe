import { describe, expect, it } from 'vitest';
import { loginSchema, type LoginFormValues } from './loginSchema';

/**
 * 로그인 폼 값을 검사하고, 칸에 보일 첫 번째 오류 글자를 돌려줍니다.
 * @param values 폼 값
 * @param field 오류를 볼 칸
 * @returns 그 칸의 첫 번째 오류 글자. 오류가 없으면 undefined
 * @example getFieldError({ email: '', password: 'a' }, 'email'); // '학교 메일을 입력해 주세요.'
 */
const getFieldError = (values: LoginFormValues, field: keyof LoginFormValues) =>
  loginSchema.safeParse(values).error?.issues.find(({ path }) => path[0] === field)?.message;

describe('loginSchema', () => {
  it('학교 메일과 비밀번호를 넣으면 통과한다', () => {
    const result = loginSchema.safeParse({
      email: 'gildong@konkuk.ac.kr',
      password: 'password1234',
    });

    expect(result.success).toBe(true);
  });

  it('대문자가 섞인 학교 메일도 받고, 앞뒤 공백을 뺀 소문자로 바꾼다', () => {
    const result = loginSchema.safeParse({
      email: ' GilDong@KONKUK.ac.kr ',
      password: 'password1234',
    });

    expect(result.data?.email).toBe('gildong@konkuk.ac.kr');
  });

  it('학교 메일이 아니면 학교 메일만 쓸 수 있다고 안내한다', () => {
    ['gildong@gmail.com', 'gildong@konkuk.ac.kr.com', 'gildong', '@konkuk.ac.kr'].forEach(
      (email) => {
        expect(getFieldError({ email, password: 'password1234' }, 'email')).toBe(
          '학교 메일만 사용할 수 있습니다.',
        );
      },
    );
  });

  it('메일이 비어 있으면 메일을 입력하라고 안내한다', () => {
    ['', '   '].forEach((email) => {
      expect(getFieldError({ email, password: 'password1234' }, 'email')).toBe(
        '학교 메일을 입력해 주세요.',
      );
    });
  });

  it('비밀번호가 비어 있으면 비밀번호를 입력하라고 안내한다', () => {
    expect(getFieldError({ email: 'gildong@konkuk.ac.kr', password: '' }, 'password')).toBe(
      '비밀번호를 입력해 주세요.',
    );
  });
});
