'use client';

import { useState } from 'react';

import { Modal, Textarea } from '@konkuk-icteam-fe/design-system/ui';

import type { WorkTimeRange } from '@/shared/apis/common';
import { formatMonthDayWithWeekday } from '@/shared/utils/formatDate';

type ChangeRequestModalProps = {
  open: boolean;
  // 뺄 근무와 더할 근무. 관리자 수정요청 화면에 그대로 보인다
  deleteSchedules: WorkTimeRange[];
  addSchedules: WorkTimeRange[];
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

// 수정 요청을 보내기 전에 바뀌는 근무를 보여 주고 사유를 받는다. 사유가 비어 있으면 보낼 수 없다
export default function ChangeRequestModal({
  open,
  deleteSchedules,
  addSchedules,
  onClose,
  onSubmit,
}: ChangeRequestModalProps) {
  const [reason, setReason] = useState('');
  const trimmedReason = reason.trim();

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) return;
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(trimmedReason);
    setReason('');
  };

  return (
    <Modal
      open={open}
      handleOpenChange={handleOpenChange}
      showCloseButton={false}
      className='bg-black-1 flex w-[calc(100%-4rem)] max-w-[40rem] flex-col gap-[1.6rem] rounded-[0.6rem] border-0 p-[2rem]'
    >
      <Modal.Header className='flex flex-col gap-[0.4rem]'>
        <Modal.Title className='font-16-bd text-black'>근로시간 수정 요청</Modal.Title>
      </Modal.Header>
      <div className='flex flex-col gap-[1.2rem]'>
        <ScheduleChangeList label='삭제' tone='red' schedules={deleteSchedules} />
        <ScheduleChangeList label='추가' tone='blue' schedules={addSchedules} />
      </div>
      <Textarea
        aria-label='수정 사유'
        placeholder='수정 사유를 입력해 주세요. 관리자가 승인할 때 확인해요.'
        rows={4}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        className='resize-none'
      />
      <Modal.Footer className='flex gap-[0.8rem]'>
        <Modal.Buttons
          buttons={[
            { label: '취소', tone: 'subtle_2', color: 'gray', size: 'medium' },
            {
              label: '요청 보내기',
              color: 'blue',
              size: 'medium',
              disabled: trimmedReason.length === 0,
              onClick: handleSubmit,
            },
          ]}
        />
      </Modal.Footer>
    </Modal>
  );
}

type ScheduleChangeListProps = {
  label: string;
  tone: 'red' | 'blue';
  schedules: WorkTimeRange[];
};

// 삭제·추가할 근무 목록. 없으면 그리지 않는다
const ScheduleChangeList = ({ label, tone, schedules }: ScheduleChangeListProps) => {
  if (schedules.length === 0) return null;

  return (
    <div className='flex flex-col gap-[0.4rem]'>
      <p className={tone === 'red' ? 'caption-12-md text-red' : 'caption-12-md text-blue'}>
        {`${label} ${schedules.length}건`}
      </p>
      <ul className='caption-14-md flex flex-col gap-[0.2rem] text-black'>
        {schedules.map(({ date, start, end }) => (
          <li key={`${date.getTime()}-${start}`}>
            {`${formatMonthDayWithWeekday(date)} ${start} - ${end}`}
          </li>
        ))}
      </ul>
    </div>
  );
};
