import { parseApiDate, parseApiDateTime, toApiDate, type ApiJson } from './common';
import { getPostedNoticesMock } from './mock/notices';

// 관리자가 올린 공지사항. 게시 기간(시작일~마감일, 둘 다 포함) 동안만 보인다 (관리자 Notice와 같은 모양)
export type Notice = {
  noticeId: number;
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
};

export type GetNoticesResponse = {
  // 오늘 게시 중인 공지. 최근에 게시를 시작한 공지가 앞
  notices: Notice[];
};

const toNotice = (json: ApiJson<Notice>): Notice => ({
  ...json,
  startDate: parseApiDate(json.startDate),
  endDate: parseApiDate(json.endDate),
  createdAt: parseApiDateTime(json.createdAt),
});

/**
 * GET /me/notices
 * 오늘 게시 중인 공지사항. 게시 예정·게시가 끝난 공지는 오지 않는다
 */
export const getNotices = (): GetNoticesResponse => ({
  notices: getPostedNoticesMock(toApiDate(new Date())).map(toNotice),
});
