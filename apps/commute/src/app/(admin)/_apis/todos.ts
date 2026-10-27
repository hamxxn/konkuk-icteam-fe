import { parseApiDate, toApiDate } from '@/app/(student)/_apis/common';
import type { TodoPeriod } from '@/app/(student)/_apis/todos';
import {
  createTodoMock,
  deleteTodoMock,
  getTodoAssignmentsMock,
  getTodosMock,
  saveTodoAssignmentsMock,
  updateTodoMock,
} from './mock/todos';

// 업무 시간대는 근로학생 API(shared/apis/todos)와 같다
export type { TodoPeriod } from '@/app/(student)/_apis/todos';

// 날마다 반복하는 업무
export type Todo = {
  todoId: number;
  title: string;
  period: TodoPeriod;
};

export type GetTodosResponse = {
  todos: Todo[];
};

// 추가한 업무는 다음 날부터 매일 반복된다
export type CreateTodoRequest = {
  title: string;
  period: TodoPeriod;
};

export type CreateTodoResponse = Todo;

// 업무 이름과 시간대를 바꾼다. 시간대를 바꾸면 그 업무에 맡긴 근로학생이 그 시간대에 근무하지 않을 수 있어 지정은 그대로 둔다
export type UpdateTodoRequest = Todo;

export type UpdateTodoResponse = Todo;

// 지운 업무는 모든 날짜의 업무 지정에서도 빠진다
export type DeleteTodoRequest = {
  todoId: number;
};

// 업무 하나를 맡은 근로학생. 같은 시간대에 근무하는 사람에게만 맡길 수 있다
export type TodoAssignment = {
  todoId: number;
  userIds: number[];
};

export type GetTodoAssignmentsRequest = {
  date: Date;
};

export type GetTodoAssignmentsResponse = {
  date: Date;
  // 한 명도 맡기지 않은 업무는 빠진다
  assignments: TodoAssignment[];
};

// 그날 업무 지정을 통째로 바꾼다. 빠진 업무는 지정이 풀린다
export type SaveTodoAssignmentsRequest = {
  date: Date;
  assignments: TodoAssignment[];
};

export type SaveTodoAssignmentsResponse = GetTodoAssignmentsResponse;

/**
 * GET /admin/todos
 * 날마다 반복하는 업무 목록
 */
export const getTodos = (): GetTodosResponse => ({ todos: getTodosMock() });

/**
 * POST /admin/todos
 * 반복 업무를 추가한다
 */
export const createTodo = (request: CreateTodoRequest): CreateTodoResponse =>
  createTodoMock(request);

/**
 * PUT /admin/todos/{todoId}
 * 반복 업무의 이름·시간대를 바꾼다
 */
export const updateTodo = (request: UpdateTodoRequest): UpdateTodoResponse =>
  updateTodoMock(request);

/**
 * DELETE /admin/todos/{todoId}
 * 반복 업무를 지운다
 */
export const deleteTodo = ({ todoId }: DeleteTodoRequest) => {
  deleteTodoMock(todoId);
};

/**
 * GET /admin/todo-assignments?date=
 * 그날 업무마다 맡은 근로학생
 */
export const getTodoAssignments = ({
  date,
}: GetTodoAssignmentsRequest): GetTodoAssignmentsResponse => {
  const dateKey = toApiDate(date);

  return { date: parseApiDate(dateKey), assignments: getTodoAssignmentsMock(dateKey) };
};

/**
 * PUT /admin/todo-assignments
 * body: { date, assignments }
 */
export const saveTodoAssignments = ({
  date,
  assignments,
}: SaveTodoAssignmentsRequest): SaveTodoAssignmentsResponse => {
  saveTodoAssignmentsMock(toApiDate(date), assignments);

  return getTodoAssignments({ date });
};
