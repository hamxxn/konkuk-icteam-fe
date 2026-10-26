'use client';

import { useState } from 'react';
import { ComboBox } from '@konkuk-icteam-fe/design-system/ui';
import type { Worker } from '../../_apis/workers';
import { findWorkerByOptionLabel, getWorkerOptionLabels } from '../_lib/workerSearch';

type WorkerSearchProps = {
  placeholder: string;
  onSelect: (worker: Worker) => void;
  autoFocus?: boolean;
  className?: string;
};

// 이름으로 근로학생을 찾아 고르는 입력칸. 디자인 시스템 ComboBox를 쓰고, 고르면 입력칸을 비운다
export default function WorkerSearch({
  placeholder,
  onSelect,
  autoFocus = false,
  className,
}: WorkerSearchProps) {
  const [keyword, setKeyword] = useState('');

  // ComboBox는 목록에서 고를 때도 고른 글자로 onChange를 부른다. 그 글자가 근로학생 항목과 같으면 고른 것으로 본다
  const handleChange = (nextKeyword: string) => {
    const selectedWorker = findWorkerByOptionLabel(nextKeyword);

    if (!selectedWorker) {
      setKeyword(nextKeyword);
      return;
    }
    onSelect(selectedWorker);
    setKeyword('');
  };

  return (
    <div className={className}>
      <ComboBox
        aria-label={placeholder}
        placeholder={placeholder}
        autoFocus={autoFocus}
        // ComboBox는 받은 목록을 그대로 보여 주므로, 입력한 글자가 들어간 항목만 넘긴다
        options={getWorkerOptionLabels().filter((label) => label.includes(keyword.trim()))}
        value={keyword}
        onChange={handleChange}
        optionWrapperClassName='relative z-30'
      />
    </div>
  );
}
