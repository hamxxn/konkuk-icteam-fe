import { parseApiDate, parseApiDateTime, toApiDate, type ApiJson } from './common';
import {
  createNoticeMock,
  deleteNoticeMock,
  getNoticesMock,
  updateNoticeMock,
} from './mock/notices';

// 근로학생에게 보이는 공지사항. 게시 기간(시작일~마감일, 둘 다 포함) 동안만 보인다
export type Notice = {
  noticeId: number;
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
};

// 공지를 등록하거나 고칠 때 보내는 값
export type NoticeInput = Pick<Notice, 'title' | 'content' | 'startDate' | 'endDate'>;

export type GetNoticesResponse = {
  // 게시가 끝나지 않은 공지 (게시 중·게시 예정). 시작일 순
  notices: Notice[];
};

export type CreateNoticeRequest = NoticeInput;

export type CreateNoticeResponse = Notice;

export type UpdateNoticeRequest = NoticeInput & {
  noticeId: number;
};

export type UpdateNoticeResponse = Notice;

export type DeleteNoticeRequest = {
  noticeId: number;
};

const toNotice = (json: ApiJson<Notice>): Notice => ({
  ...json,
  startDate: parseApiDate(json.startDate),
  endDate: parseApiDate(json.endDate),
  createdAt: parseApiDateTime(json.createdAt),
});

const toNoticeInputJson = ({
  title,
  content,
  startDate,
  endDate,
}: NoticeInput): ApiJson<NoticeInput> => ({
  title,
  content,
  startDate: toApiDate(startDate),
  endDate: toApiDate(endDate),
});

/**
 * GET /admin/notices
 * 게시 중이거나 게시 예정인 공지사항
 */
export const getNotices = (): GetNoticesResponse => ({
  notices: getNoticesMock(toApiDate(new Date())).map(toNotice),
});

/**
 * POST /admin/notices
 * 공지사항을 등록한다
 */
export const createNotice = (request: CreateNoticeRequest): CreateNoticeResponse =>
  toNotice(createNoticeMock(toNoticeInputJson(request)));

/**
 * PUT /admin/notices/{noticeId}
 * 공지사항의 제목·내용·게시 기간을 바꾼다
 */
export const updateNotice = ({
  noticeId,
  ...input
}: UpdateNoticeRequest): UpdateNoticeResponse | undefined => {
  const saved = updateNoticeMock(noticeId, toNoticeInputJson(input));

  return saved ? toNotice(saved) : undefined;
};

/**
 * DELETE /admin/notices/{noticeId}
 * 공지사항을 지운다. 근로학생에게서도 바로 사라진다
 */
export const deleteNotice = ({ noticeId }: DeleteNoticeRequest) => {
  deleteNoticeMock(noticeId);
};
