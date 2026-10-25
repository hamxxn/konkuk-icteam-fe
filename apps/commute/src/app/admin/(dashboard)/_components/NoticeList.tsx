import { IconPencil, IconTrash } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { IconButton, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import type { Notice } from '../../_apis/notices';
import { formatDateRange } from '@/shared/utils/formatDate';

type NoticeListProps = {
  notices: Notice[];
  // 지금 고치는 공지. 목록에서 눈에 띄게 한다
  editingNoticeId: number | null;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
};

/**
 * 오늘 기준으로 공지가 근로학생에게 보이는 중인지 확인합니다.
 * @param notice 게시가 끝나지 않은 공지
 * @param today 오늘 0시
 * @returns 시작일이 지났으면 true (게시 중), 아직이면 false (게시 예정)
 * @example checkNoticePosted(notice, new Date(2026, 9, 25)); // true
 */
const checkNoticePosted = ({ startDate }: Notice, today: Date) => startDate <= today;

// 게시 중·게시 예정인 공지 목록. 공지마다 게시 기간과 내용을 보여 주고, 고치거나 지운다
export default function NoticeList({
  notices,
  editingNoticeId,
  onEdit,
  onDelete,
}: NoticeListProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (notices.length === 0) {
    return (
      <p className='caption-14-md py-[4rem] text-center text-gray-400'>
        근로학생에게 보이는 공지가 없어요.
      </p>
    );
  }

  return (
    <ul className='flex flex-col'>
      {notices.map((notice) => {
        const { noticeId, title, content, startDate, endDate } = notice;
        const isPosted = checkNoticePosted(notice, today);

        return (
          <li
            key={noticeId}
            className={cn(
              'flex flex-col gap-[0.6rem] border-b border-gray-50 px-[0.4rem] py-[1.2rem] last:border-b-0',
              editingNoticeId === noticeId && 'bg-blue/5 rounded-[0.8rem]',
            )}
          >
            <div className='flex items-center gap-[0.8rem]'>
              <StateChip
                label={isPosted ? '게시 중' : '게시 예정'}
                tone={isPosted ? 'green' : 'blue'}
              />
              <p className='font-14-bd min-w-0 flex-1 truncate text-black'>{title}</p>
              <IconButton
                aria-label={`${title} 수정`}
                className='text-gray-400 hover:text-black'
                onClick={() => onEdit(notice)}
              >
                <IconPencil aria-hidden className='h-[1.6rem] w-[1.6rem]' />
              </IconButton>
              <IconButton
                aria-label={`${title} 삭제`}
                className='hover:text-red text-gray-400'
                onClick={() => onDelete(notice)}
              >
                <IconTrash aria-hidden className='h-[1.6rem] w-[1.6rem]' />
              </IconButton>
            </div>
            <p className='caption-12-md text-gray-500'>{formatDateRange(startDate, endDate)}</p>
            <p className='caption-14-rg line-clamp-2 whitespace-pre-line text-gray-700'>
              {content}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
