'use client';

import { useId, useState } from 'react';
import { CheckBox, Message, SearchBar } from '@konkuk-icteam-fe/design-system/ui';
import AdminPanel from '../../_layouts/AdminPanel';
import { getWorkers, type Worker } from '../../_apis/workers';

type StudentSelectPanelProps = {
  monthLabel: string;
  selectedUserIds: number[];
  isEditable: boolean;
  // 고른 학생에 대한 오류 글자 (예: 한 명도 고르지 않음)
  error?: string;
  onChange: (userIds: number[]) => void;
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

// 그 달 근무를 신청할 수 있는 근로학생을 고른다. 고르지 않은 학생은 신청할 수 없다.
// 이름·학과·학번으로 찾을 수 있고, 전체 선택은 지금 보이는 학생에게만 적용된다
export default function StudentSelectPanel({
  monthLabel,
  selectedUserIds,
  isEditable,
  error,
  onChange,
}: StudentSelectPanelProps) {
  const [keyword, setKeyword] = useState('');
  const errorId = useId();
  const trimmedKeyword = keyword.trim();
  const visibleWorkers = getWorkers().workers.filter((worker) =>
    checkKeywordMatch(worker, trimmedKeyword),
  );
  const visibleUserIds = visibleWorkers.map(({ userId }) => userId);
  const isAllVisibleSelected =
    visibleUserIds.length > 0 && visibleUserIds.every((userId) => selectedUserIds.includes(userId));

  const handleToggle = (userId: number) => {
    onChange(
      selectedUserIds.includes(userId)
        ? selectedUserIds.filter((selectedId) => selectedId !== userId)
        : [...selectedUserIds, userId],
    );
  };

  // 검색 중이면 보이는 학생만 넣고 빼서, 검색에 걸리지 않은 학생의 선택은 그대로 둔다
  const handleToggleAll = () => {
    onChange(
      isAllVisibleSelected
        ? selectedUserIds.filter((userId) => !visibleUserIds.includes(userId))
        : [...new Set([...selectedUserIds, ...visibleUserIds])],
    );
  };

  return (
    // 오른쪽 칸 높이는 왼쪽 설정 패널에 맞춘다. 학생이 많으면 목록 안에서 스크롤한다
    <AdminPanel title={`${monthLabel} 근로학생 선택`} className='flex h-full flex-col'>
      <div className='bg-black-1 mx-[2.1rem] mb-[2rem] flex min-h-0 flex-1 flex-col gap-[1.2rem] rounded-[1.2rem] border border-gray-50 p-[1.6rem]'>
        <p className='caption-12-md text-gray-500'>고른 학생만 근무 시간을 신청할 수 있어요.</p>
        <SearchBar
          aria-label='근로학생 검색'
          placeholder='이름·학과·학번으로 찾기'
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          containerClassName='rounded-[0.8rem]'
        />
        <CheckBox
          checked={isAllVisibleSelected}
          disabled={!isEditable || visibleUserIds.length === 0}
          onChange={handleToggleAll}
          className='font-14-bd border-b border-gray-50 pb-[1.2rem] text-black'
        >
          {trimmedKeyword ? `검색 결과 전체 선택 (${visibleUserIds.length}명)` : '전체 선택'}
        </CheckBox>
        {visibleWorkers.length === 0 ? (
          <p className='caption-14-md py-[2.4rem] text-center text-gray-400'>
            검색결과가 없습니다.
          </p>
        ) : (
          <ul className='flex min-h-0 flex-1 flex-col overflow-y-auto'>
            {visibleWorkers.map(({ userId, name, department, studentId }) => (
              <li key={userId} className='border-b border-gray-50 py-[1rem] last:border-b-0'>
                <CheckBox
                  checked={selectedUserIds.includes(userId)}
                  disabled={!isEditable}
                  onChange={() => handleToggle(userId)}
                  className='w-full'
                >
                  <span className='flex min-w-0 flex-1 flex-col'>
                    <span className='font-14-bd text-black'>{name}</span>
                    <span className='caption-12-rg truncate text-gray-500'>
                      {`${department ?? '학과 미입력'} · ${studentId ?? '학번 미입력'}`}
                    </span>
                  </span>
                </CheckBox>
              </li>
            ))}
          </ul>
        )}
        <Message id={errorId} message={error} variant='error' />
      </div>
    </AdminPanel>
  );
}
