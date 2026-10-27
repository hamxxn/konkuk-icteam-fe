import { getNoticesMock } from '@/app/(admin)/_apis/mock/notices';

/**
 * 오늘 게시 중인 공지 목업을 얻습니다. 관리자 공지 저장소에서 시작일이 지난 공지만 고릅니다.
 * @param todayKey 오늘 (YYYY-MM-DD)
 * @returns 게시 중인 공지 JSON (최근에 시작한 공지가 앞)
 * @example getPostedNoticesMock('2026-10-27');
 */
export const getPostedNoticesMock = (todayKey: string) =>
  getNoticesMock(todayKey)
    .filter(({ startDate }) => startDate <= todayKey)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
