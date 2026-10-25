import { toISO } from '@konkuk-icteam-fe/design-system/date';
import type { ApiJson } from '../common';
import type { Notice, NoticeInput } from '../notices';

type NoticeJson = ApiJson<Notice>;

/**
 * 오늘에서 며칠 옮긴 날을 YYYY-MM-DD로 얻습니다.
 * @param days 옮길 날 수 (음수면 지난날)
 * @returns YYYY-MM-DD
 * @example getDateKeyFromToday(1); // 내일
 */
const getDateKeyFromToday = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISO(date);
};

/**
 * 지금 시각을 서버가 보내는 날짜·시각 글자로 얻습니다.
 * @returns YYYY-MM-DDTHH:mm:ss (한국 시간)
 * @example getNowDateTime(); // '2026-10-25T14:30:00'
 */
const getNowDateTime = () => {
  const now = new Date();
  return `${toISO(now)}T${now.toTimeString().slice(0, 8)}`;
};

// 등록한 공지사항. 오늘 기준으로 게시 중인 것과 게시 예정인 것을 하나씩 둔다
const NOTICES: NoticeJson[] = [
  {
    noticeId: 1,
    title: '11월 근로신청 안내',
    content: '11월 근무 시간 신청을 이번 주 금요일까지 받습니다. 기간 안에 꼭 신청해 주세요.',
    startDate: getDateKeyFromToday(-3),
    endDate: getDateKeyFromToday(4),
    createdAt: `${getDateKeyFromToday(-3)}T09:00:00`,
  },
  {
    noticeId: 2,
    title: '정보운영팀 사무실 소독 안내',
    content: '소독 작업으로 오후 근무는 3층 회의실에서 진행합니다.',
    startDate: getDateKeyFromToday(5),
    endDate: getDateKeyFromToday(7),
    createdAt: `${getDateKeyFromToday(-1)}T15:20:00`,
  },
];

// 게시가 끝나지 않은 공지 (게시 중·게시 예정). 시작일 순
export const getNoticesMock = (todayKey: string) =>
  NOTICES.filter(({ endDate }) => endDate >= todayKey).sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );

export const createNoticeMock = (input: ApiJson<NoticeInput>): NoticeJson => {
  const notice = {
    ...input,
    noticeId: Math.max(0, ...NOTICES.map(({ noticeId }) => noticeId)) + 1,
    createdAt: getNowDateTime(),
  };
  NOTICES.push(notice);

  return notice;
};

export const updateNoticeMock = (noticeId: number, input: ApiJson<NoticeInput>) => {
  const index = NOTICES.findIndex((notice) => notice.noticeId === noticeId);
  const saved = NOTICES[index];
  if (!saved) return undefined;

  const notice = { ...saved, ...input };
  NOTICES[index] = notice;

  return notice;
};

export const deleteNoticeMock = (noticeId: number) => {
  const index = NOTICES.findIndex((notice) => notice.noticeId === noticeId);
  if (index >= 0) NOTICES.splice(index, 1);
};
