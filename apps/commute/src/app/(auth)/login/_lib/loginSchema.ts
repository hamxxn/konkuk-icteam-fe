import { z } from 'zod';

// 학교 메일: 아이디 + @konkuk.ac.kr. 아이디에는 공백과 @가 없다
const SCHOOL_EMAIL_PATTERN = /^[^\s@]+@konkuk\.ac\.kr$/;

// 로그인 폼. 학교 메일과 비밀번호를 받는다.
// 메일은 대소문자를 가리지 않으므로 앞뒤 공백을 빼고 소문자로 바꾼 뒤 검사한다
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, '학교 메일을 입력해 주세요.')
    .regex(SCHOOL_EMAIL_PATTERN, '학교 메일만 사용할 수 있습니다.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
