import { WORKERS_MOCK } from './workers';
import type { CreateTodoRequest, Todo, TodoAssignment } from '../todos';

// 날마다 반복하는 업무. 추가한 업무는 여기에 붙는다
const TODOS: Todo[] = [
  { todoId: 1, period: 'MORNING', title: '사무실 오픈 및 PC 전원 켜기' },
  { todoId: 2, period: 'MORNING', title: '문의 메일·전화 응대' },
  { todoId: 3, period: 'MORNING', title: '프린터·복합기 점검' },
  { todoId: 4, period: 'MORNING', title: '강의실 기자재 점검' },
  { todoId: 5, period: 'MORNING', title: '택배·우편물 정리' },
  { todoId: 6, period: 'AFTERNOON', title: '장비 대여·반납 처리' },
  { todoId: 7, period: 'AFTERNOON', title: '회의실 예약 확인 및 세팅' },
  { todoId: 8, period: 'AFTERNOON', title: '비품 재고 확인' },
  { todoId: 9, period: 'AFTERNOON', title: '분실물 보관함 정리' },
  { todoId: 10, period: 'AFTERNOON', title: '퇴근 전 소등 및 문단속' },
];

// 날짜(YYYY-MM-DD)별 업무 지정
const ASSIGNMENTS_BY_DATE: Record<string, TodoAssignment[]> = {};

export const getTodosMock = () => [...TODOS];

export const createTodoMock = ({ title, period }: CreateTodoRequest): Todo => {
  const todo = { todoId: Math.max(0, ...TODOS.map(({ todoId }) => todoId)) + 1, title, period };
  TODOS.push(todo);

  return todo;
};

export const updateTodoMock = (todo: Todo): Todo => {
  const index = TODOS.findIndex(({ todoId }) => todoId === todo.todoId);
  if (index >= 0) TODOS[index] = todo;

  return todo;
};

export const deleteTodoMock = (todoId: number) => {
  const index = TODOS.findIndex((todo) => todo.todoId === todoId);
  if (index >= 0) TODOS.splice(index, 1);

  Object.entries(ASSIGNMENTS_BY_DATE).forEach(([dateKey, assignments]) => {
    ASSIGNMENTS_BY_DATE[dateKey] = assignments.filter((assignment) => assignment.todoId !== todoId);
  });
};

export const getTodoAssignmentsMock = (dateKey: string) => ASSIGNMENTS_BY_DATE[dateKey] ?? [];

// 시작 시각만 정하고 아직 아무도 맡기지 않은 업무도 시작 시각을 기억해 둔다
export const saveTodoAssignmentsMock = (dateKey: string, assignments: TodoAssignment[]) => {
  ASSIGNMENTS_BY_DATE[dateKey] = assignments;
};

/**
 * 근로학생마다 업무를 지금까지 몇 번 했는지 목업으로 셉니다. 업무·사람마다 정해진 지난 횟수에,
 * 오늘 전 날짜에 저장한 지정 횟수를 더합니다.
 * @param todoId 업무 id
 * @param todayKey 오늘 (YYYY-MM-DD). 이날부터의 지정은 아직 하지 않은 것으로 본다
 * @returns 사람별 횟수 (0번인 사람은 뺌)
 * @example getTodoAssigneeCountsMock(6, '2026-10-27'); // [{ userId: 2, count: 3 }, ...]
 */
export const getTodoAssigneeCountsMock = (todoId: number, todayKey: string) =>
  WORKERS_MOCK.map(({ userId }) => {
    const baseCount = (todoId * 7 + userId * 3) % 6;
    const savedCount = Object.entries(ASSIGNMENTS_BY_DATE).filter(
      ([dateKey, assignments]) =>
        dateKey < todayKey &&
        assignments.some(
          (assignment) => assignment.todoId === todoId && assignment.userIds.includes(userId),
        ),
    ).length;

    return { userId, count: baseCount + savedCount };
  }).filter(({ count }) => count > 0);
