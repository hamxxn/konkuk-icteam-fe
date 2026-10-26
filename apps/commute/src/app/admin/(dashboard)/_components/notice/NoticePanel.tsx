'use client';

import { useReducer, useState } from 'react';
import { ConfirmModal } from '@konkuk-icteam-fe/design-system/ui';
import {
  createNotice,
  deleteNotice,
  getNotices,
  updateNotice,
  type Notice,
  type NoticeInput,
} from '../../../_apis/notices';
import AdminPanel from '../../../_layouts/AdminPanel';
import NoticeForm from './NoticeForm';
import NoticeList from './NoticeList';

type NoticePanelProps = {
  // 공지를 등록·수정·삭제한 뒤 알릴 글자
  onNotify: (message: string) => void;
};

// 공지사항 관리. 왼쪽에서 게시 기간을 정해 공지를 등록하고, 오른쪽에서 근로학생에게 보이는 공지를 보고 고치거나 지운다
export default function NoticePanel({ onNotify }: NoticePanelProps) {
  // 왼쪽 폼에서 고치는 중인 공지
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  // 지울지 묻는 중인 공지
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);
  // 등록·수정·삭제한 뒤 목록을 다시 불러오게 한다
  const [, refresh] = useReducer((count: number) => count + 1, 0);

  const { notices } = getNotices();

  const handleSubmit = (input: NoticeInput) => {
    if (editingNotice) {
      updateNotice({ noticeId: editingNotice.noticeId, ...input });
      setEditingNotice(null);
      onNotify('공지사항을 수정했어요.');
    } else {
      createNotice(input);
      onNotify('공지사항을 등록했어요.');
    }
    refresh();
  };

  const handleDeleteConfirm = () => {
    if (!deletingNotice) return;
    deleteNotice({ noticeId: deletingNotice.noticeId });
    if (editingNotice?.noticeId === deletingNotice.noticeId) setEditingNotice(null);
    setDeletingNotice(null);
    refresh();
    onNotify('공지사항을 삭제했어요.');
  };

  return (
    <AdminPanel title='공지사항'>
      <div className='mx-[2.1rem] mb-[2rem] grid grid-cols-2 items-start gap-[2.4rem]'>
        <section className='bg-black-1 flex flex-col gap-[1.6rem] rounded-[1.2rem] border border-gray-50 p-[1.6rem]'>
          <h3 className='font-16-bd text-black'>{editingNotice ? '공지 수정' : '공지 등록'}</h3>
          {/* 고치는 공지가 바뀌면 그 값으로 폼을 새로 연다 */}
          <NoticeForm
            key={editingNotice?.noticeId ?? 'new'}
            notice={editingNotice ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setEditingNotice(null)}
          />
        </section>

        <section className='bg-black-1 flex flex-col gap-[0.8rem] rounded-[1.2rem] border border-gray-50 p-[1.6rem]'>
          <div className='flex items-baseline justify-between'>
            <h3 className='font-16-bd text-black'>근로학생에게 보이는 공지</h3>
            <span className='caption-12-md text-gray-400'>{`${notices.length}건`}</span>
          </div>
          <NoticeList
            notices={notices}
            editingNoticeId={editingNotice?.noticeId ?? null}
            onEdit={setEditingNotice}
            onDelete={setDeletingNotice}
          />
        </section>
      </div>

      <ConfirmModal
        open={deletingNotice !== null}
        handleOpenChange={(open) => {
          if (!open) setDeletingNotice(null);
        }}
        title='공지사항을 삭제하시겠습니까?'
        description='지운 공지는 근로학생에게서도 바로 사라집니다.'
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          { label: '삭제하기', color: 'red', size: 'medium', onClick: handleDeleteConfirm },
        ]}
      />
    </AdminPanel>
  );
}
