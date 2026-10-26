'use client';

import { useReducer, useState } from 'react';
import { IconAdd, IconPencil, IconTrash } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { ConfirmModal, IconButton, TagChip } from '@konkuk-icteam-fe/design-system/ui';
import {
  createTodo,
  deleteTodo,
  getTodoAssignments,
  getTodos,
  saveTodoAssignments,
  updateTodo,
  type Todo,
  type TodoPeriod,
} from '../../../_apis/todos';
import { getWorkerChipTone } from '@/shared/utils/getWorkerChipTone';
import { PERIODS } from '../../../_constants/period';
import TaskForm from './TaskForm';
import type { OnDutyWorker } from '../../_utils/getWorkersByPeriod';

type AssignTaskListProps = {
  dateKey: string;
  // 시간대별로 그날 근무하는 근로학생. 업무는 그 시간대에 근무하는 사람에게만 맡길 수 있다
  workersByPeriod: Record<TodoPeriod, OnDutyWorker[]>;
  // 업무를 추가·수정·삭제한 뒤 알릴 글자
  onNotify: (message: string) => void;
};

// 날짜 카드 오른쪽 칸. 반복 업무를 오전·오후로 나눠 보여 주고, 업무마다 근로학생을 여러 명 지정한다.
// 지정은 날짜별로 따로 저장한다. 시간대 옆 + 로 업무를 추가하고, 업무마다 이름·시간대를 고치거나 지운다
export default function AssignTaskList({
  dateKey,
  workersByPeriod,
  onNotify,
}: AssignTaskListProps) {
  // 근로학생을 고르는 중인 업무. 한 번에 한 업무만 펼친다
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  // 이름·시간대를 고치는 중인 업무
  const [renamingTaskId, setRenamingTaskId] = useState<number | null>(null);
  // 업무를 추가하는 중인 시간대. 그 시간대 목록 맨 아래에 입력 줄을 연다
  const [addingPeriod, setAddingPeriod] = useState<TodoPeriod | null>(null);
  // 지울지 묻는 중인 업무
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  // 지정을 저장한 뒤 다시 불러오게 한다
  const [, refresh] = useReducer((count: number) => count + 1, 0);

  const date = parseISO(dateKey);
  const { todos } = getTodos();
  // 업무 id → 지정한 근로학생 id 목록
  const assignments: Record<number, number[]> = Object.fromEntries(
    getTodoAssignments({ date }).assignments.map(({ todoId, userIds }) => [todoId, userIds]),
  );

  const handleWorkerToggle = (todoId: number, userId: number) => {
    const assignees = assignments[todoId] ?? [];
    const nextAssignments = {
      ...assignments,
      [todoId]: assignees.includes(userId)
        ? assignees.filter((assigneeId) => assigneeId !== userId)
        : [...assignees, userId],
    };

    saveTodoAssignments({
      date,
      assignments: Object.entries(nextAssignments).map(([id, userIds]) => ({
        todoId: Number(id),
        userIds,
      })),
    });
    refresh();
  };

  // 한 번에 입력 줄 하나만 연다
  const handleAddStart = (period: TodoPeriod) => {
    setEditingTaskId(null);
    setRenamingTaskId(null);
    setAddingPeriod(period);
  };

  const handleTodoAdd = (title: string, period: TodoPeriod) => {
    createTodo({ title, period });
    setAddingPeriod(null);
    onNotify('업무를 추가했어요.');
  };

  const handleRenameStart = (todoId: number) => {
    setEditingTaskId(null);
    setAddingPeriod(null);
    setRenamingTaskId(todoId);
  };

  const handleTodoUpdate = (todoId: number, title: string, period: TodoPeriod) => {
    updateTodo({ todoId, title, period });
    setRenamingTaskId(null);
    onNotify('업무를 수정했어요.');
  };

  const handleDeleteConfirm = () => {
    if (!deletingTodo) return;
    deleteTodo({ todoId: deletingTodo.todoId });
    if (editingTaskId === deletingTodo.todoId) setEditingTaskId(null);
    setDeletingTodo(null);
    onNotify('업무를 삭제했어요.');
  };

  return (
    <div className='flex flex-col gap-[1.6rem]'>
      {PERIODS.map(({ period, label }) => {
        const workers = workersByPeriod[period];
        const getWorkerName = (userId: number) =>
          workers.find((worker) => worker.userId === userId)?.userName ?? '';

        return (
          <section key={period} aria-label={`${label} 업무`}>
            <div className='flex items-center justify-between border-b border-gray-50 px-[0.4rem] pb-[0.8rem]'>
              <div className='flex items-center gap-[0.4rem]'>
                <h4 className='font-14-bd text-black'>{label}</h4>
                <IconButton
                  aria-label={`${label} 업무 추가`}
                  aria-expanded={addingPeriod === period}
                  className='group'
                  onClick={() => handleAddStart(period)}
                >
                  <IconAdd
                    aria-hidden
                    className='group-hover:text-blue h-[1.6rem] w-[1.6rem] text-gray-400'
                  />
                </IconButton>
              </div>
              <span className='caption-12-md text-gray-400'>
                {workers.length === 0 ? '근무자 없음' : `근무자 ${workers.length}명`}
              </span>
            </div>
            <ul className='flex flex-col'>
              {todos
                .filter((todo) => todo.period === period)
                .map((todo) => {
                  const { todoId: id, title } = todo;
                  // 날짜를 바꾸면 그 시간대에 근무하지 않는 학생은 빼고 보여 준다
                  const assignees = (assignments[id] ?? []).filter((userId) =>
                    getWorkerName(userId),
                  );
                  const isEditing = editingTaskId === id;

                  if (renamingTaskId === id) {
                    return (
                      <li key={id} className='border-b border-gray-50 py-[0.9rem] last:border-b-0'>
                        <TaskForm
                          label={`${title} 수정`}
                          initialTitle={title}
                          initialPeriod={todo.period}
                          canChangePeriod
                          submitLabel='저장'
                          onSubmit={(nextTitle, nextPeriod) =>
                            handleTodoUpdate(id, nextTitle, nextPeriod)
                          }
                          onCancel={() => setRenamingTaskId(null)}
                        />
                      </li>
                    );
                  }

                  return (
                    <li
                      key={id}
                      className='group border-b border-gray-50 py-[0.9rem] last:border-b-0'
                    >
                      <div className='flex items-center gap-[1rem]'>
                        <p className='caption-14-md w-[18rem] shrink-0 text-black'>{title}</p>
                        <div className='flex min-w-0 flex-1 flex-wrap items-center gap-[0.4rem]'>
                          {assignees.length === 0 ? (
                            <span className='caption-12-md text-gray-400'>미지정</span>
                          ) : (
                            assignees.map((userId) => (
                              <TagChip
                                key={userId}
                                label={getWorkerName(userId)}
                                tone={getWorkerChipTone(userId)}
                                onRemove={() => handleWorkerToggle(id, userId)}
                              />
                            ))
                          )}
                        </div>
                        <button
                          type='button'
                          aria-expanded={isEditing}
                          disabled={workers.length === 0}
                          className={cn(
                            'caption-12-md flex shrink-0 cursor-pointer items-center gap-[0.2rem] rounded-[0.6rem] px-[0.8rem] py-[0.4rem] transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                            isEditing
                              ? 'bg-blue text-black-1'
                              : 'text-blue hover:bg-blue/10 bg-gray-50',
                          )}
                          onClick={() => setEditingTaskId(isEditing ? null : id)}
                        >
                          {isEditing ? (
                            '완료'
                          ) : (
                            <>
                              <IconAdd aria-hidden className='h-[1.4rem] w-[1.4rem]' />
                              지정
                            </>
                          )}
                        </button>
                        {/* 줄에 마우스를 올리거나 키보드로 들어오면 보인다 */}
                        <div className='flex shrink-0 items-center gap-[0.2rem] opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'>
                          <IconButton
                            aria-label={`${title} 수정`}
                            className='group'
                            onClick={() => handleRenameStart(id)}
                          >
                            <IconPencil
                              aria-hidden
                              className='h-[1.6rem] w-[1.6rem] text-gray-400 group-hover:text-black'
                            />
                          </IconButton>
                          <IconButton
                            aria-label={`${title} 삭제`}
                            className='group'
                            onClick={() => setDeletingTodo(todo)}
                          >
                            <IconTrash
                              aria-hidden
                              className='group-hover:text-red h-[1.6rem] w-[1.6rem] text-gray-400'
                            />
                          </IconButton>
                        </div>
                      </div>

                      {isEditing ? (
                        <div
                          role='group'
                          aria-label={`${title} 근로학생 선택`}
                          className='mt-[0.8rem] flex flex-wrap gap-[0.6rem] rounded-[0.8rem] bg-gray-50 p-[1rem]'
                        >
                          {workers.map(({ userId, userName }) => {
                            const isAssigned = assignees.includes(userId);

                            return (
                              <button
                                key={userId}
                                type='button'
                                aria-pressed={isAssigned}
                                className={cn(
                                  'caption-12-md cursor-pointer rounded-full border px-[1rem] py-[0.4rem] transition-colors',
                                  isAssigned
                                    ? 'border-blue bg-blue text-black-1'
                                    : 'bg-black-1 hover:border-blue border-gray-400 text-gray-700',
                                )}
                                onClick={() => handleWorkerToggle(id, userId)}
                              >
                                {userName}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              {addingPeriod === period ? (
                <li className='py-[0.9rem]'>
                  <TaskForm
                    label={`${label} 업무 추가`}
                    initialPeriod={period}
                    submitLabel='추가'
                    onSubmit={handleTodoAdd}
                    onCancel={() => setAddingPeriod(null)}
                  />
                </li>
              ) : null}
            </ul>
          </section>
        );
      })}

      <ConfirmModal
        open={deletingTodo !== null}
        handleOpenChange={(open) => {
          if (!open) setDeletingTodo(null);
        }}
        title='업무를 삭제하시겠습니까?'
        description={
          deletingTodo
            ? `'${deletingTodo.title}'을(를) 지우면 모든 날짜의 지정도 함께 사라집니다.`
            : undefined
        }
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          { label: '삭제하기', color: 'red', size: 'medium', onClick: handleDeleteConfirm },
        ]}
      />
    </div>
  );
}
