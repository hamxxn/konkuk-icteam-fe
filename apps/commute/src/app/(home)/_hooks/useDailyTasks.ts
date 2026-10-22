import { useState } from 'react';
import { TaskPeriod, type TaskItem } from '../_types';
import { createDailyTasksMock } from '../mock';

type DailyTasks = Record<TaskPeriod, TaskItem[]>;

const formatCurrentTime = () => {
  const now = new Date();

  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// 고른 날의 오전·오후 업무를 관리한다. 업무는 그날 근무하는 사람들이 함께 체크해서, 동료가 체크한 것도 같이 보인다
export const useDailyTasks = (date: string, userName: string) => {
  const [mockBaseDate] = useState(() => new Date());
  // 내가 체크해서 바뀐 날의 업무 (날짜 → 오전·오후 업무)
  const [updatedTasks, setUpdatedTasks] = useState<Record<string, DailyTasks>>({});

  //TODOS: API 호출로 고른 날의 업무 가져오기 (GET todos?date=). 지금은 목업으로 만든다
  const dailyTasks = updatedTasks[date] ?? createDailyTasksMock(date, mockBaseDate);

  //TODOS: 업무 완료 API 호출 (date, todoId, isCompleted)
  // 업무 id는 오전·오후를 통틀어 겹치지 않아서 id만으로 찾는다
  const handleToggleTask = (taskId: number) => {
    const toggleTask = (task: TaskItem): TaskItem =>
      task.completed
        ? { id: task.id, title: task.title, completed: false }
        : { ...task, completed: true, completedBy: userName, completedTime: formatCurrentTime() };
    const toggleIfTarget = (task: TaskItem) => (task.id === taskId ? toggleTask(task) : task);

    setUpdatedTasks((prev) => ({
      ...prev,
      [date]: {
        [TaskPeriod.MORNING]: dailyTasks[TaskPeriod.MORNING].map(toggleIfTarget),
        [TaskPeriod.AFTERNOON]: dailyTasks[TaskPeriod.AFTERNOON].map(toggleIfTarget),
      },
    }));
  };

  return { dailyTasks, handleToggleTask };
};
