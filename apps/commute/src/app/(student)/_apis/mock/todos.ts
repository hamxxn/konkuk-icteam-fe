import { formatNumber, toISO } from '@konkuk-icteam-fe/design-system/date';
import { getTodoAssignmentsMock, getTodosMock } from '@/app/(admin)/_apis/mock/todos';
import type { ApiJson } from '../common';
import type { DailyTodo, TodoPeriod, TodoUser } from '../todos';
import { MY_USER_ID } from './me';
import { getTeamDaySlotsMock } from './workSchedules';

type Completion = { completedBy: TodoUser; completedAt: string };

// 화면에서 바꾼 완료 여부 ('YYYY-MM-DD:todoId' → 완료 정보, 취소했으면 null). 새로 고침하면 처음으로 돌아간다
const UPDATED_COMPLETIONS: Record<string, Completion | null> = {};

const PERIOD_START_HOUR: Record<TodoPeriod, number> = { MORNING: 9, AFTERNOON: 13 };

const NOON = '12:00';

const createCompletionKey = (dateKey: string, todoId: number) => `${dateKey}:${todoId}`;

/**
 * 그날 시간대별로 근무하는 근로학생을 모읍니다. 관리자 업무 지정과 같이 12시 전에 시작하는 칸이 오전입니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @returns 오전·오후 근무자 (한 사람은 한 번만)
 * @example getOnDutyUsers('2026-10-27').MORNING; // [{ userId: 1, userName: '홍길동' }, ...]
 */
const getOnDutyUsers = (dateKey: string): Record<TodoPeriod, TodoUser[]> => {
  const slots = getTeamDaySlotsMock(dateKey);
  const collectUsers = (checkStart: (start: string) => boolean) =>
    slots
      .filter(({ start }) => checkStart(start))
      .flatMap(({ users }) => users)
      .map(({ userId, userName }) => ({ userId, userName }))
      .filter(
        (user, index, users) => users.findIndex(({ userId }) => userId === user.userId) === index,
      );

  return {
    MORNING: collectUsers((start) => start < NOON),
    AFTERNOON: collectUsers((start) => start >= NOON),
  };
};

/**
 * 관리자가 그날 아무도 지정하지 않았을 때 쓸 데모 담당자를 만듭니다. 시간대 근무자에게 업무를 차례로 한 명씩 맡기고,
 * 시간대 마지막 업무는 미지정으로 둡니다. 관리자 목업 저장소에는 넣지 않습니다
 * (저장소를 바꾸면 서버·브라우저의 관리자 화면이 서로 달라져 hydration 오류가 납니다).
 * @param onDutyUsers 시간대별 근무자
 * @returns 업무별 담당자 id
 * @example createDemoAssignments(getOnDutyUsers('2026-10-27'));
 */
const createDemoAssignments = (onDutyUsers: Record<TodoPeriod, TodoUser[]>) => {
  const todos = getTodosMock();

  return todos.flatMap((todo) => {
    const periodTodos = todos.filter(({ period }) => period === todo.period);
    const indexInPeriod = periodTodos.findIndex(({ todoId }) => todoId === todo.todoId);
    const isLastInPeriod = indexInPeriod === periodTodos.length - 1;
    const users = onDutyUsers[todo.period];
    const assignee = users[indexInPeriod % Math.max(users.length, 1)];

    return assignee && !isLastInPeriod ? [{ todoId: todo.todoId, userIds: [assignee.userId] }] : [];
  });
};

/**
 * 처음 보여 줄 완료 여부를 정합니다. 지난 날은 모두 완료, 오늘은 시간대별 첫 업무만 완료해 두었습니다.
 * 완료한 사람은 담당자이고, 미지정 업무는 그 시간대 근무자입니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param period 업무 시간대
 * @param indexInPeriod 시간대 안에서 몇 번째 업무인지 (0부터)
 * @param candidates 완료했을 사람 후보 (담당자, 없으면 그 시간대 근무자)
 * @returns 완료 정보. 완료하지 않았으면 null
 * @example createBaseCompletion('2026-10-20', 'MORNING', 0, [{ userId: 2, userName: '김민지' }]);
 */
const createBaseCompletion = (
  dateKey: string,
  period: TodoPeriod,
  indexInPeriod: number,
  candidates: TodoUser[],
): Completion | null => {
  const todayKey = toISO(new Date());
  const isCompleted = dateKey < todayKey || (dateKey === todayKey && indexInPeriod === 0);
  const completedBy = candidates[0];
  if (!isCompleted || !completedBy) return null;

  return {
    completedBy,
    completedAt: `${dateKey}T${formatNumber(PERIOD_START_HOUR[period])}:${formatNumber(indexInPeriod * 7 + 5)}:00`,
  };
};

/**
 * 그날 업무 목업을 얻습니다. 업무 목록과 담당자는 관리자 목업(반복 업무·업무 지정)을 그대로 쓰고,
 * 관리자 화면처럼 그 시간대에 근무하지 않는 담당자는 뺍니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @returns 그날 업무 JSON
 * @example getDailyTodosMock('2026-10-27');
 */
export const getDailyTodosMock = (dateKey: string): ApiJson<DailyTodo>[] => {
  const onDutyUsers = getOnDutyUsers(dateKey);
  const savedAssignments = getTodoAssignmentsMock(dateKey);
  const assignments =
    savedAssignments.length > 0 ? savedAssignments : createDemoAssignments(onDutyUsers);
  const todos = getTodosMock();

  return todos.map((todo) => {
    const periodUsers = onDutyUsers[todo.period];
    const assigneeIds = assignments.find(({ todoId }) => todoId === todo.todoId)?.userIds ?? [];
    const assignees = periodUsers.filter(({ userId }) => assigneeIds.includes(userId));
    const indexInPeriod = todos
      .filter(({ period }) => period === todo.period)
      .findIndex(({ todoId }) => todoId === todo.todoId);
    const key = createCompletionKey(dateKey, todo.todoId);
    const completion =
      key in UPDATED_COMPLETIONS
        ? (UPDATED_COMPLETIONS[key] ?? null)
        : createBaseCompletion(
            dateKey,
            todo.period,
            indexInPeriod,
            assignees.length > 0 ? assignees : periodUsers,
          );

    return {
      ...todo,
      assignees,
      isCompleted: completion !== null,
      completedBy: completion?.completedBy ?? null,
      completedAt: completion?.completedAt ?? null,
    };
  });
};

export const updateTodoCompletionMock = (todoId: number, dateKey: string, isCompleted: boolean) => {
  const now = new Date();
  const me = Object.values(getOnDutyUsers(dateKey))
    .flat()
    .find(({ userId }) => userId === MY_USER_ID);

  UPDATED_COMPLETIONS[createCompletionKey(dateKey, todoId)] = isCompleted
    ? {
        completedBy: me ?? { userId: MY_USER_ID, userName: '' },
        completedAt: `${dateKey}T${now.toTimeString().slice(0, 8)}`,
      }
    : null;

  const todo = getDailyTodosMock(dateKey).find((item) => item.todoId === todoId);
  if (!todo) throw new Error(`업무(${todoId})를 찾을 수 없습니다.`);

  return todo;
};
