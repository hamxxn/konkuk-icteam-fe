import { parseApiDate, parseApiDateTime, toApiDate, type ApiJson } from './common';
import { getDailyTodosMock, updateTodoCompletionMock } from './mock/todos';

// 업무 시간대. 12시 전에 시작하는 근무는 오전, 나머지는 오후 (관리자 TodoPeriod와 같다)
export type TodoPeriod = 'MORNING' | 'AFTERNOON';

export type TodoUser = {
  userId: number;
  userName: string;
};

// 그날 업무 한 건. 관리자가 만든 반복 업무에 그날 담당자와 완료 여부를 붙인 것
export type DailyTodo = {
  todoId: number;
  title: string;
  period: TodoPeriod;
  // 관리자가 그날 이 업무를 맡긴 근로학생. 아무도 맡기지 않았으면 빈 배열이고, 그 시간대 근무자 누구나 한다
  assignees: TodoUser[];
  isCompleted: boolean;
  // 완료한 사람과 시각. 완료하지 않았으면 null
  completedBy: TodoUser | null;
  completedAt: Date | null;
};

export type GetDailyTodosRequest = {
  date: Date;
};

export type GetDailyTodosResponse = {
  date: Date;
  todos: DailyTodo[];
};

// 그날 업무를 완료하거나 완료를 취소한다. 완료한 사람은 로그인한 근로학생이다
export type UpdateTodoCompletionRequest = {
  todoId: number;
  date: Date;
  isCompleted: boolean;
};

export type UpdateTodoCompletionResponse = DailyTodo;

const toDailyTodo = (json: ApiJson<DailyTodo>): DailyTodo => ({
  ...json,
  completedAt: json.completedAt ? parseApiDateTime(json.completedAt) : null,
});

/**
 * GET /me/todos?date=
 * 그날 오전·오후 업무와 담당자, 완료 여부
 */
export const getDailyTodos = ({ date }: GetDailyTodosRequest): GetDailyTodosResponse => {
  const dateKey = toApiDate(date);

  return { date: parseApiDate(dateKey), todos: getDailyTodosMock(dateKey).map(toDailyTodo) };
};

/**
 * PATCH /me/todos/{todoId}
 * body: { date, isCompleted }
 */
export const updateTodoCompletion = ({
  todoId,
  date,
  isCompleted,
}: UpdateTodoCompletionRequest): UpdateTodoCompletionResponse =>
  toDailyTodo(updateTodoCompletionMock(todoId, toApiDate(date), isCompleted));
