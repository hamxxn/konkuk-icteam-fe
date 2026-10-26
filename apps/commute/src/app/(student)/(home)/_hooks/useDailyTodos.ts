import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { useState } from 'react';
import {
  getDailyTodos,
  updateTodoCompletion,
  type DailyTodo,
  type TodoPeriod,
} from '@/shared/apis/todos';

// 고른 날의 오전·오후 업무를 관리한다. 업무는 그날 근무하는 사람들이 함께 체크해서, 동료가 체크한 것도 같이 보인다
export const useDailyTodos = (date: string) => {
  // 내가 체크해서 바뀐 업무 ('YYYY-MM-DD:todoId' → 업무)
  const [updatedTodos, setUpdatedTodos] = useState<Record<string, DailyTodo>>({});

  const todos = getDailyTodos({ date: parseISO(date) }).todos.map(
    (todo) => updatedTodos[`${date}:${todo.todoId}`] ?? todo,
  );

  const getTodosByPeriod = (period: TodoPeriod) => todos.filter((todo) => todo.period === period);

  const handleToggleTodo = (todo: DailyTodo) => {
    const updatedTodo = updateTodoCompletion({
      todoId: todo.todoId,
      date: parseISO(date),
      isCompleted: !todo.isCompleted,
    });

    setUpdatedTodos((prev) => ({ ...prev, [`${date}:${todo.todoId}`]: updatedTodo }));
  };

  return { getTodosByPeriod, handleToggleTodo };
};
