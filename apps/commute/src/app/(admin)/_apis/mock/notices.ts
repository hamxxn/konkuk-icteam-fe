import { toISO } from '@konkuk-icteam-fe/design-system/date';
import type { ApiJson } from '@/shared/apis/common';
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

// 등록한 공지사항. 오늘 기준으로 게시 중인 것 여러 개(내용이 긴 것 포함)와 게시 예정·게시 끝난 것을 둔다
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
  {
    noticeId: 3,
    title: '출근 체크 방법 변경 안내',
    content:
      '이번 주부터 출근 체크는 출근부 홈 화면의 "출근하기" 버튼으로만 받습니다.\n근무 시작 10분 전부터 버튼이 열리고, 근무 시작 시각이 지나서 누르면 지각으로 기록됩니다.\n휴대폰을 두고 왔거나 버튼이 열리지 않으면 사무실 PC에서 출근부에 로그인해 체크하고, 그래도 안 되면 카카오톡 1:1 채팅으로 바로 알려 주세요. 사후에 말하면 지각 처리를 바꿀 수 없습니다.',
    startDate: getDateKeyFromToday(-1),
    endDate: getDateKeyFromToday(10),
    createdAt: `${getDateKeyFromToday(-1)}T10:30:00`,
  },
  {
    noticeId: 4,
    title: '장비 대여 대장 작성 부탁',
    content: '노트북·빔프로젝터를 빌려줄 때는 대여 대장에 학번과 반납 예정일을 꼭 적어 주세요.',
    startDate: getDateKeyFromToday(-7),
    endDate: getDateKeyFromToday(14),
    createdAt: `${getDateKeyFromToday(-7)}T13:00:00`,
  },
  {
    noticeId: 5,
    title: '이번 주 금요일 오후 근무 단축',
    content:
      '건물 전기 점검으로 금요일은 16시에 근무를 마칩니다. 16시 이후 근무는 근무 시간으로 인정됩니다.',
    startDate: getDateKeyFromToday(0),
    endDate: getDateKeyFromToday(3),
    createdAt: `${getDateKeyFromToday(0)}T08:00:00`,
  },
  {
    noticeId: 6,
    title: '10월 근무 기록 확인 요청',
    content: '10월 근무 기록에 빠진 날이 있으면 이번 달 안에 알려 주세요.',
    startDate: getDateKeyFromToday(-14),
    endDate: getDateKeyFromToday(-2),
    createdAt: `${getDateKeyFromToday(-14)}T09:00:00`,
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
