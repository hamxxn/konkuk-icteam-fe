'use client';

import { useToast } from '@/shared/hooks/useToast';
import DateBoard from './_components/DateBoard';
import NoticePanel from './_components/NoticePanel';

// 관리자 메인 대시보드. 맨 위에서 처리할 승인 요청을 알리고, 날짜 카드에서 그날 근무 시간표를 보며 업무를 추가·수정·삭제하고 맡긴다.
// 아래에서 게시 기간을 정해 공지사항을 등록하고, 근로학생에게 보이는 공지를 고치거나 지운다
export default function PageClient() {
  const { showToast, toast } = useToast();

  return (
    <>
      <DateBoard onNotify={showToast} />
      <NoticePanel onNotify={showToast} />

      {toast}
    </>
  );
}
