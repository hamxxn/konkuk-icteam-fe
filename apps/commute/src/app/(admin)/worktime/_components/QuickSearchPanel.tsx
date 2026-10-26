'use client';

import { IconFilter } from '@konkuk-icteam-fe/design-system/assets';
import type { Worker } from '../../_apis/workers';
import WorkerSearch from './WorkerSearch';

type QuickSearchPanelProps = {
  // 고른 근무자를 알린다. 시간표는 이 사람이 없는 칸을 흐리게 한다
  onSelectedWorkerChange: (worker: Worker | null) => void;
};

// 이름으로 근무자를 찾는다. 고르면 시간표에서 그 사람이 근무하는 칸만 또렷하게 보인다
export default function QuickSearchPanel({ onSelectedWorkerChange }: QuickSearchPanelProps) {
  return (
    <aside className='bg-black-1 flex items-center gap-[1.2rem] rounded-[1.6rem] border border-gray-50 p-[2.4rem] shadow-[0_4px_20px_0_rgba(0,0,0,0.04)]'>
      <IconFilter />
      <WorkerSearch
        placeholder='이름을 입력하여 시간 확인'
        onSelect={onSelectedWorkerChange}
        className='flex-1'
      />
    </aside>
  );
}
