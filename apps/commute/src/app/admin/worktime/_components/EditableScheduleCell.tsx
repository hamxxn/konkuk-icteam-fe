'use client';

import { useRef, useState } from 'react';
import { IconAdd, IconClose } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { IconButton, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { getWorkerChipTone } from '../../_lib/getWorkerChipTone';
import type { WorkScheduleUser } from '../../_apis/workSchedules';
import type { ScheduleCell, ScheduleCellWorker } from '../_hooks/useWeekSchedule';
import AddWorkerPopover from './AddWorkerPopover';

type EditableScheduleCellProps = {
  cell: ScheduleCell;
  isEditMode: boolean;
  // 오른쪽 열에서는 추가 카드가 시간표 밖으로 넘치지 않게 칸 오른쪽 끝에 맞춰 연다
  opensSearchToLeft?: boolean;
  onAdd: (cell: ScheduleCell, user: ScheduleCellWorker) => void;
  onRemoveRequest: (cell: ScheduleCell, user: WorkScheduleUser) => void;
};

// 편집 화면의 근무 칸. 편집 중이면 이름 옆 X로 빼고, 아래 추가 버튼을 누르면 뜨는 카드에서 사람을 찾아 넣는다
export default function EditableScheduleCell({
  cell,
  isEditMode,
  opensSearchToLeft = false,
  onAdd,
  onRemoveRequest,
}: EditableScheduleCellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className='flex flex-wrap gap-[0.4rem]'>
        {cell.users.map((user) => (
          <span key={user.userId} className='inline-flex items-center'>
            <StateChip label={user.userName} tone={getWorkerChipTone(user.userId)} />
            {isEditMode ? (
              <IconButton
                aria-label={`${user.userName} 빼기`}
                className='text-red ml-[0.2rem]'
                onClick={() => onRemoveRequest(cell, user)}
              >
                <IconClose aria-hidden className='h-[1.4rem] w-[1.4rem]' />
              </IconButton>
            ) : null}
          </span>
        ))}
      </div>

      {isEditMode && (
        <div
          ref={searchRef}
          className='relative mt-auto'
          // 추가 카드 바깥으로 초점이 나가면 닫는다
          onBlur={(event) => {
            if (!searchRef.current?.contains(event.relatedTarget as Node)) setIsSearchOpen(false);
          }}
        >
          <button
            type='button'
            aria-expanded={isSearchOpen}
            className={cn(
              'caption-12-md text-blue border-blue flex w-full cursor-pointer items-center justify-center gap-[0.2rem] rounded-[0.6rem] border border-dashed py-[0.4rem]',
              isSearchOpen && 'bg-blue/5',
            )}
            onClick={() => setIsSearchOpen((prev) => !prev)}
          >
            <IconAdd aria-hidden className='h-[1.4rem] w-[1.4rem]' />
            추가
          </button>
          {isSearchOpen && (
            <AddWorkerPopover
              excludedUserIds={cell.users.map(({ userId }) => userId)}
              alignRight={opensSearchToLeft}
              onSelect={({ userId, name }) => {
                onAdd(cell, { userId, userName: name });
                setIsSearchOpen(false);
              }}
              onClose={() => setIsSearchOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
}
