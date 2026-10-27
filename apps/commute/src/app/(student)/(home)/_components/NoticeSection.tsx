'use client';

import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { useEffect, useRef, useState } from 'react';
import { getNotices, type Notice } from '@/app/(student)/_apis/notices';

// 관리자가 올린 공지 중 오늘 게시 중인 것. 공지가 없으면 자리를 차지하지 않는다
export default function NoticeSection() {
  const [{ notices }] = useState(getNotices);
  // 더보기로 펼친 공지. 처음에는 모두 접어 둔다
  const [expandedNoticeId, setExpandedNoticeId] = useState<number | null>(null);

  if (notices.length === 0) return null;

  const handleToggleNotice = (noticeId: number) => {
    setExpandedNoticeId((prev) => (prev === noticeId ? null : noticeId));
  };

  return (
    <section
      aria-label='공지사항'
      className='rounded-[0.6rem] border border-gray-50 px-[2rem] py-[1.6rem]'
    >
      {notices.map((notice) => (
        <NoticeItem
          key={notice.noticeId}
          notice={notice}
          isExpanded={notice.noticeId === expandedNoticeId}
          onToggle={() => handleToggleNotice(notice.noticeId)}
        />
      ))}
    </section>
  );
}

type NoticeItemProps = {
  notice: Notice;
  isExpanded: boolean;
  onToggle: () => void;
};

// 공지 한 건. 내용은 두 줄까지만 보여 주고, 넘치면 더보기 버튼으로 펼친다
const NoticeItem = ({ notice, isExpanded, onToggle }: NoticeItemProps) => {
  const contentId = `notice-content-${notice.noticeId}`;
  const contentRef = useRef<HTMLParagraphElement>(null);
  // 접어 둔 내용이 두 줄을 넘는지. 화면 너비가 바뀌면 다시 잰다
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    // 펼친 동안에는 잘린 곳이 없어서 재지 않고, 접을 때 쓸 값을 그대로 둔다
    if (!content || isExpanded) return;

    const checkOverflow = () => setIsOverflowing(content.scrollHeight > content.clientHeight);
    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(content);

    return () => observer.disconnect();
  }, [notice.content, isExpanded]);

  return (
    <article className='flex flex-col gap-[0.8rem] border-b border-gray-50 py-[1.2rem] first:pt-0 last:border-b-0 last:pb-0'>
      <h2 className='font-16-bd flex items-center gap-[0.6rem] text-black'>📢 {notice.title}</h2>
      <p
        ref={contentRef}
        id={contentId}
        className={cn(
          'caption-14-md whitespace-pre-line text-gray-700',
          !isExpanded && 'line-clamp-2',
        )}
      >
        {notice.content}
      </p>
      {(isOverflowing || isExpanded) && (
        <button
          type='button'
          aria-expanded={isExpanded}
          aria-controls={contentId}
          className='caption-12-md cursor-pointer self-end text-gray-500 hover:text-black'
          onClick={onToggle}
        >
          {isExpanded ? '접기' : '더보기'}
        </button>
      )}
    </article>
  );
};
