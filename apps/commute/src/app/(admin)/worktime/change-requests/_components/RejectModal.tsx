'use client';

import { useState } from 'react';
import { ConfirmModal, Textarea } from '@konkuk-icteam-fe/design-system/ui';

type RejectModalProps = {
  // 반려할 요청을 낸 사람. 없으면 닫혀 있다
  requesterName: string | null;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

// 근무 변경 요청을 반려할 때 사유를 받는다. 사유가 비어 있으면 반려할 수 없다
export default function RejectModal({ requesterName, onClose, onSubmit }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const trimmedReason = reason.trim();

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setReason('');
    onClose();
  };

  return (
    <ConfirmModal
      open={requesterName !== null}
      handleOpenChange={handleOpenChange}
      title={`${requesterName ?? ''}님의 요청을 반려하시겠습니까?`}
      description='반려 사유는 근로학생에게 그대로 보입니다.'
      layoutClassName='w-[40rem]'
      buttons={[
        { label: '취소', tone: 'subtle_2', color: 'gray', size: 'medium' },
        {
          label: '반려',
          color: 'red',
          size: 'medium',
          disabled: trimmedReason.length === 0,
          onClick: () => {
            onSubmit(trimmedReason);
            setReason('');
          },
        },
      ]}
    >
      <Textarea
        aria-label='반려 사유'
        placeholder='반려 사유를 입력해 주세요.'
        rows={4}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
    </ConfirmModal>
  );
}
