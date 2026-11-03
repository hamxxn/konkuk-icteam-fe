import { describe, expect, it } from 'vitest';
import { getSchoolEmailSuggestions } from './schoolEmail';

describe('getSchoolEmailSuggestions', () => {
  it('아이디만 입력하면 학교 메일을 후보로 보여 준다', () => {
    expect(getSchoolEmailSuggestions('gildong')).toEqual(['gildong@konkuk.ac.kr']);
  });

  it('@ 뒤를 학교 메일 앞부분까지만 입력해도 나머지를 채운 후보를 보여 준다', () => {
    ['gildong@', 'gildong@ko', 'gildong@KONKUK.ac'].forEach((input) => {
      expect(getSchoolEmailSuggestions(input)).toEqual(['gildong@konkuk.ac.kr']);
    });
  });

  it('학교 메일을 다 입력했으면 후보가 없다', () => {
    expect(getSchoolEmailSuggestions('gildong@konkuk.ac.kr')).toEqual([]);
  });

  it('다른 도메인을 입력하면 후보가 없다', () => {
    expect(getSchoolEmailSuggestions('gildong@gmail.com')).toEqual([]);
  });

  it('비어 있거나 아이디 없이 @부터 입력하면 후보가 없다', () => {
    ['', '   ', '@', '@konkuk'].forEach((input) => {
      expect(getSchoolEmailSuggestions(input)).toEqual([]);
    });
  });
});
