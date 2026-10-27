import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { formatNumber } from '@konkuk-icteam-fe/design-system/date';
import { CheckBox } from '@konkuk-icteam-fe/design-system/ui';
import type { DailyTodo } from '@/app/(student)/_apis/todos';

type DailyTaskPanelProps = {
  todos: DailyTodo[];
  // 로그인한 근로학생. 관리자가 나에게 맡긴 업무만 보여 준다
  myUserId: number;
  onToggleTodo: (todo: DailyTodo) => void;
};

// 오전 또는 오후 업무 중 나에게 맡긴 것만 모은 체크리스트. 근무 일정 카드에서 펼친 근무 바로 아래에 들어간다
export default function DailyTaskPanel({ todos, myUserId, onToggleTodo }: DailyTaskPanelProps) {
  const myTodos = todos.filter(({ assignees }) =>
    assignees.some(({ userId }) => userId === myUserId),
  );

  return (
    <section className='mt-[1.2rem] rounded-[0.6rem] bg-gray-50 px-[1.2rem] py-[1.2rem]'>
      {myTodos.length > 0 ? (
        <ul>
          {myTodos.map((todo) => (
            <TodoItem key={todo.todoId} todo={todo} onToggle={onToggleTodo} />
          ))}
        </ul>
      ) : (
        <p className='caption-12-md py-[1.2rem] text-gray-400'>나에게 맡긴 업무가 없습니다.</p>
      )}
    </section>
  );
}

type TodoItemProps = {
  todo: DailyTodo;
  onToggle: (todo: DailyTodo) => void;
};

const formatTime = (date: Date) =>
  `${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}`;

// 업무 한 줄. 완료했으면 완료한 사람과 시각을 함께 보여 준다 (같은 업무를 여러 명이 맡을 수 있다)
const TodoItem = ({ todo, onToggle }: TodoItemProps) => (
  <li className='border-b border-gray-400/20 py-[1rem] last:border-b-0'>
    <CheckBox checked={todo.isCompleted} onChange={() => onToggle(todo)}>
      <span className='flex min-w-0 flex-col gap-[0.2rem]'>
        <span
          className={cn(
            'caption-14-md truncate',
            todo.isCompleted ? 'text-gray-400 line-through' : 'text-black',
          )}
        >
          {todo.title}
        </span>
        {todo.isCompleted && todo.completedBy && todo.completedAt && (
          <span className='caption-11-md text-gray-500'>
            {`${todo.completedBy.userName} ${formatTime(todo.completedAt)} 완료`}
          </span>
        )}
      </span>
    </CheckBox>
  </li>
);
