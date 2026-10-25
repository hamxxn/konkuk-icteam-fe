import { z } from 'zod';

/**
 * 공지 등록·수정 폼 스키마를 만듭니다. 게시 기간에 오늘 이전 날짜는 넣을 수 없습니다.
 * 이미 게시 중인 공지를 고칠 때는 원래 시작일을 그대로 둘 수 있게 그날을 가장 이른 시작일로 받습니다.
 * @param minStartDate 고를 수 있는 가장 이른 시작일 (0시)
 * @returns 제목과 내용은 앞뒤 공백을 빼고 돌려주는 zod 스키마
 * @example createNoticeSchema(today).safeParse(values).success; // false (시작일이 어제면)
 */
export const createNoticeSchema = (minStartDate: Date) =>
  z
    .object({
      title: z.string().trim().min(1, '제목을 입력해 주세요.'),
      content: z.string().trim().min(1, '내용을 입력해 주세요.'),
      startDate: z.date().min(minStartDate, '오늘 이전 날짜는 게시 기간에 넣을 수 없어요.'),
      endDate: z.date(),
    })
    .refine(({ startDate, endDate }) => startDate <= endDate, {
      message: '게시 마감일이 시작일보다 빨라요.',
      path: ['endDate'],
    });

export type NoticeFormValues = z.infer<ReturnType<typeof createNoticeSchema>>;
