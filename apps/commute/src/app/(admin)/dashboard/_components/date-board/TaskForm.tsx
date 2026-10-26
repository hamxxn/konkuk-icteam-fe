'use client';

import { useState } from 'react';
import { Button, Input, TagChip } from '@konkuk-icteam-fe/design-system/ui';
import type { TodoPeriod } from '../../../_apis/todos';
import { PERIODS } from '../../../_constants/period';

type TaskFormProps = {
  // 폼 묶음을 읽어 줄 이름 (예: '오전 업무 추가', '비품 재고 확인 수정')
  label: string;
  initialTitle?: string;
  initialPeriod: TodoPeriod;
  // 시간대를 바꿀 수 있는지. 추가는 누른 시간대(+)로 정해져 있어 고칠 때만 연다
  canChangePeriod?: boolean;
  submitLabel: string;
  onSubmit: (title: string, period: TodoPeriod) => void;
  onCancel: () => void;
};

// 업무 지정 목록 안에서 업무를 추가하거나 고치는 줄. 이름을 정하고, 고칠 때는 시간대도 바꾼다. Enter로 저장, Escape로 취소한다
export default function TaskForm({
  label,
  initialTitle = '',
  initialPeriod,
  canChangePeriod = false,
  submitLabel,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [period, setPeriod] = useState(initialPeriod);
  const trimmedTitle = title.trim();

  const handleSubmit = () => {
    if (trimmedTitle.length === 0) return;
    onSubmit(trimmedTitle, period);
  };

  return (
    <div
      role='group'
      aria-label={label}
      className='flex flex-col gap-[0.8rem] rounded-[0.8rem] bg-gray-50 p-[1rem]'
    >
      <Input
        aria-label='업무 명'
        placeholder='업무 이름을 입력하세요'
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          // 한글 조합 중 Enter는 글자 확정이라 저장으로 보지 않는다
          if (event.nativeEvent.isComposing) return;
          if (event.key === 'Enter') handleSubmit();
          if (event.key === 'Escape') onCancel();
        }}
      />
      <div className='flex items-center justify-between gap-[0.8rem]'>
        {canChangePeriod ? (
          <div role='group' aria-label='시간대' className='flex gap-[0.6rem]'>
            {PERIODS.map((option) => (
              <TagChip
                key={option.period}
                label={option.label}
                tone='blue'
                isSelected={period === option.period}
                onClick={() => setPeriod(option.period)}
              />
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className='flex gap-[0.6rem]'>
          <Button
            display='inline'
            size='small'
            tone='subtle_2'
            color='gray'
            className='w-[6rem]'
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            display='inline'
            size='small'
            color='blue'
            className='w-[6rem]'
            disabled={trimmedTitle.length === 0}
            onClick={handleSubmit}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
