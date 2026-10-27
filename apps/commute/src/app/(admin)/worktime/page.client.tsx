'use client';

import { useState } from 'react';
import { Button, ConfirmModal } from '@konkuk-icteam-fe/design-system/ui';
import { useToast } from '@/shared/hooks/useToast';
import type { Worker } from '../_apis/workers';
import type { WorkScheduleUser } from '../_apis/workSchedules';
import EditableScheduleCell from './_components/EditableScheduleCell';
import PendingRequestsPanel from './_components/PendingRequestsPanel';
import QuickSearchPanel from './_components/QuickSearchPanel';
import WeekRangeNavigator from './_components/WeekRangeNavigator';
import WeekScheduleGrid from './_components/WeekScheduleGrid';
import {
  useWeekSchedule,
  type ScheduleCell,
  type ScheduleCellWorker,
} from './_hooks/useWeekSchedule';
import { getWeekStartKey, shiftWeek } from './_utils/weekKey';
import { formatMonthDay } from '@/shared/utils/formatDate';

type RemoveTarget = { cell: ScheduleCell; user: WorkScheduleUser };

// 이 요일 열부터(0 = 월) 칸의 검색창을 왼쪽으로 연다
const SEARCH_TO_LEFT_FROM_COLUMN = 3;

// 근로시간 관리. 편집하기를 누르면 칸마다 근무자를 넣고 뺄 수 있다. 오른쪽에서 근무자를 찾고 승인 대기 수정요청을 미리 본다
export default function PageClient() {
  const [weekStartKey, setWeekStartKey] = useState(() => getWeekStartKey(new Date()));
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredWorker, setFilteredWorker] = useState<Worker | null>(null);
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);
  const { showToast, toast } = useToast();
  const schedule = useWeekSchedule(weekStartKey);

  const handleAdd = (cell: ScheduleCell, user: ScheduleCellWorker) => {
    const isAdded = schedule.handleUserAdd(cell, user);
    showToast(
      isAdded
        ? `${user.userName}님을 ${cell.start}에 배치했어요.`
        : `${user.userName}님은 이미 이 시간에 배치되어 있어요.`,
    );
  };

  const handleRemoveConfirm = () => {
    if (!removeTarget) return;
    schedule.handleUserRemove(removeTarget.user.scheduleId);
    showToast(`${removeTarget.user.userName}님을 뺐어요.`);
  };

  return (
    <div className='mx-auto grid w-full max-w-[150rem] grid-cols-[minmax(0,1fr)_30rem] items-start gap-[2.4rem] p-[3.4rem]'>
      <section className='bg-black-1 flex flex-col gap-[2.4rem] rounded-[1.2rem] border border-gray-50 p-[2.4rem]'>
        <div className='flex items-center justify-between gap-[1.6rem]'>
          <WeekRangeNavigator
            weekStartKey={weekStartKey}
            onMove={(delta) => setWeekStartKey((prev) => shiftWeek(prev, delta))}
          />
          <Button
            display='inline'
            size='medium'
            tone={isEditMode ? 'subtle_2' : 'solid'}
            color={isEditMode ? 'black' : 'blue'}
            className='w-[12rem]'
            onClick={() => setIsEditMode((prev) => !prev)}
          >
            {isEditMode ? '편집 끝내기' : '편집하기'}
          </Button>
        </div>

        <WeekScheduleGrid
          days={schedule.days}
          maxConcurrentWorkers={schedule.maxConcurrentWorkers}
          focusedUserId={filteredWorker?.userId ?? null}
          renderCell={(cell, columnIndex) => (
            <EditableScheduleCell
              cell={cell}
              isEditMode={isEditMode}
              // 목·금 열은 검색창을 왼쪽으로 연다
              opensSearchToLeft={columnIndex >= SEARCH_TO_LEFT_FROM_COLUMN}
              onAdd={handleAdd}
              onRemoveRequest={(targetCell, user) => setRemoveTarget({ cell: targetCell, user })}
            />
          )}
        />
      </section>

      {/* 스크롤해도 오른쪽 칸은 화면에 붙어 있다 */}
      <div className='sticky top-[2.4rem] flex flex-col gap-[1.6rem]'>
        <QuickSearchPanel onSelectedWorkerChange={setFilteredWorker} />
        <PendingRequestsPanel />
      </div>

      <ConfirmModal
        open={removeTarget !== null}
        handleOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        title='인원을 빼시겠습니까?'
        description={
          removeTarget
            ? `${removeTarget.user.userName} / ${formatMonthDay(removeTarget.cell.dateKey)} ${removeTarget.cell.start}-${removeTarget.cell.end}`
            : undefined
        }
        buttons={[
          { label: '취소', tone: 'subtle_2', color: 'gray', size: 'medium' },
          { label: '빼기', color: 'red', size: 'medium', onClick: handleRemoveConfirm },
        ]}
      />
      {toast}
    </div>
  );
}
