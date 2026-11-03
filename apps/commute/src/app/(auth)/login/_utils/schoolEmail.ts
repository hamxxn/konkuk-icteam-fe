const SCHOOL_EMAIL_DOMAIN = 'konkuk.ac.kr';

/**
 * 메일 칸에 입력한 글자로 자동완성할 학교 메일 후보를 만듭니다.
 * @param input 메일 칸에 입력한 글자
 * @returns 학교 메일 후보 목록
 * @example getSchoolEmailSuggestions('gildong'); // ['gildong@konkuk.ac.kr']
 */
export const getSchoolEmailSuggestions = (input: string) => {
  // 아이디는 @ 앞, 도메인은 @ 뒤. @가 없으면 도메인은 빈 글자다
  const [localPart, domainPart = ''] = input.trim().split('@');
  if (!localPart) return [];

  const typedDomain = domainPart.toLowerCase();
  // 학교 메일 도메인의 앞부분까지만 입력했을 때만 채운다. 다 입력했거나 다른 도메인이면 채울 것이 없다
  const isTypingSchoolDomain =
    typedDomain !== SCHOOL_EMAIL_DOMAIN && SCHOOL_EMAIL_DOMAIN.startsWith(typedDomain);

  return isTypingSchoolDomain ? [`${localPart}@${SCHOOL_EMAIL_DOMAIN}`] : [];
};
