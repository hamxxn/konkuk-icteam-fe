import { describe, expect, it } from 'vitest';
import { createNoticeSchema } from './noticeSchema';

const TODAY = new Date(2026, 9, 27);

const createValues = (startDate: Date, endDate: Date) => ({
  title: ' 공지 ',
  content: '내용',
  startDate,
  endDate,
});

describe('createNoticeSchema', () => {
  it('제목·내용의 앞뒤 공백을 빼서 돌려준다', () => {
    const result = createNoticeSchema(TODAY).safeParse(createValues(TODAY, new Date(2026, 9, 30)));

    expect(result.data?.title).toBe('공지');
  });

  it('공백만 있는 제목은 안 된다', () => {
    const result = createNoticeSchema(TODAY).safeParse({
      ...createValues(TODAY, TODAY),
      title: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('오늘 이전 날짜는 게시 기간에 넣을 수 없다', () => {
    const result = createNoticeSchema(TODAY).safeParse(
      createValues(new Date(2026, 9, 26), new Date(2026, 9, 30)),
    );

    expect(result.error?.issues[0]?.message).toBe('오늘 이전 날짜는 게시 기간에 넣을 수 없어요.');
  });

  it('게시 중인 공지는 원래 시작일을 그대로 둘 수 있다', () => {
    const originalStartDate = new Date(2026, 9, 22);
    const schema = createNoticeSchema(originalStartDate);

    expect(schema.safeParse(createValues(originalStartDate, new Date(2026, 9, 30))).success).toBe(
      true,
    );
  });

  it('마감일이 시작일보다 빠르면 마감일 칸에 오류를 붙인다', () => {
    const result = createNoticeSchema(TODAY).safeParse(
      createValues(new Date(2026, 9, 30), new Date(2026, 9, 28)),
    );

    expect(result.error?.issues[0]?.path).toEqual(['endDate']);
  });
});
