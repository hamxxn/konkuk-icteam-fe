'use client';

import { useState } from 'react';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { SearchBar, useComposingEnter } from '@konkuk-icteam-fe/design-system/ui';
import { getWorkers, type Worker } from '../../_apis/workers';
import { formatWorkerDetail } from '../_utils/workerLabel';

type AddWorkerPopoverProps = {
  // 이미 그 칸에 있는 사람. 목록에서 뺀다
  excludedUserIds: number[];
  // 오른쪽 열에서는 시간표 밖으로 넘치지 않게 오른쪽 끝에 맞춰 연다
  alignRight?: boolean;
  onSelect: (worker: Worker) => void;
  onClose: () => void;
};

/**
 * 검색어가 근로학생의 이름·학과·학번 중 하나에 들어가는지 확인합니다.
 * @param worker 근로학생
 * @param keyword 검색어 (앞뒤 공백 제외). 비어 있으면 늘 true
 * @returns 검색어에 맞으면 true
 * @example checkKeywordMatch(worker, '컴퓨터'); // true (컴퓨터공학부)
 */
const checkKeywordMatch = ({ name, department, studentId }: Worker, keyword: string) =>
  [name, department, studentId].some((value) => value?.includes(keyword));

// 근무 칸에 넣을 근로학생을 찾아 고르는 작은 카드. 방향키로 옮기고 Enter로 고르며, Esc로 닫는다
export default function AddWorkerPopover({
  excludedUserIds,
  alignRight = false,
  onSelect,
  onClose,
}: AddWorkerPopoverProps) {
  const [keyword, setKeyword] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const getCandidates = (searchKeyword: string) =>
    getWorkers().workers.filter(
      (worker) =>
        !excludedUserIds.includes(worker.userId) && checkKeywordMatch(worker, searchKeyword.trim()),
    );
  const candidates = getCandidates(keyword);
  const activeWorker = candidates[Math.min(activeIndex, candidates.length - 1)];

  // 글자를 바꾸면 강조가 첫 항목으로 돌아가므로, 확정된 글자의 첫 후보를 고른다
  const selectFirstCandidate = (confirmedKeyword: string) => {
    const [firstCandidate] = getCandidates(confirmedKeyword);
    if (firstCandidate) onSelect(firstCandidate);
  };

  // 한글 조합 중 누른 Enter는 조합이 끝난 뒤 확정된 글자로 고른다
  const { handleComposingEnter, handleCompositionEnd } = useComposingEnter(selectFirstCandidate);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((prev) => Math.min(Math.max(prev + delta, 0), candidates.length - 1));
      return;
    }
    if (event.key !== 'Enter') return;

    event.preventDefault();
    if (handleComposingEnter(event)) return;
    if (activeWorker) onSelect(activeWorker);
  };

  return (
    <div
      role='dialog'
      aria-label='근로학생 추가'
      className={cn(
        'bg-black-1 absolute top-[calc(100%+0.4rem)] z-30 flex w-[24rem] flex-col gap-[0.8rem] rounded-[1.2rem] p-[1rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)]',
        alignRight ? 'right-0' : 'left-0',
      )}
    >
      <SearchBar
        autoFocus
        aria-label='근로학생 검색'
        placeholder='이름·학과·학번'
        value={keyword}
        onChange={(event) => {
          setKeyword(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        onCompositionEnd={handleCompositionEnd}
        containerClassName='rounded-[0.8rem] px-[1rem] py-[0.8rem]'
        iconClassName='h-[1.8rem] w-[1.8rem]'
      />
      {candidates.length === 0 ? (
        <p className='caption-12-md py-[1.2rem] text-center text-gray-400'>
          넣을 수 있는 근로학생이 없어요.
        </p>
      ) : (
        <ul className='flex max-h-[24rem] flex-col overflow-y-auto'>
          {candidates.map((worker) => {
            const isActive = worker.userId === activeWorker?.userId;
            const detail = formatWorkerDetail(worker);

            return (
              <li key={worker.userId}>
                <button
                  type='button'
                  className={cn(
                    'flex w-full cursor-pointer flex-col items-start rounded-[0.6rem] px-[1rem] py-[0.8rem] text-left',
                    isActive ? 'bg-gray-50' : 'hover:bg-gray-50',
                  )}
                  onMouseEnter={() => setActiveIndex(candidates.indexOf(worker))}
                  onClick={() => onSelect(worker)}
                >
                  <span className='font-14-bd text-black'>{worker.name}</span>
                  {detail ? <span className='caption-12-rg text-gray-500'>{detail}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
