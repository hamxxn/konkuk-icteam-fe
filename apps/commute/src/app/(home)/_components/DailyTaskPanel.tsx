import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { CheckBox } from '@konkuk-icteam-fe/design-system/ui';
import type { TaskItem } from '../_types';

type DailyTaskPanelProps = {
  tasks: TaskItem[];
  onToggleTask: (taskId: number) => void;
};

// 오전 또는 오후 업무 체크리스트. 근무 일정 카드에서 펼친 근무 바로 아래에 들어간다
export default function DailyTaskPanel({ tasks, onToggleTask }: DailyTaskPanelProps) {
  return (
    <section className='mt-[1.2rem] rounded-[0.6rem] bg-gray-50 px-[1.2rem] py-[1.2rem]'>
      {tasks.length > 0 ? (
        <TaskChecklist tasks={tasks} onToggleTask={onToggleTask} />
      ) : (
        <p className='caption-12-md py-[1.2rem] text-gray-400'>등록된 업무 사항이 없습니다.</p>
      )}
    </section>
  );
}

type TaskChecklistProps = {
  tasks: TaskItem[];
  onToggleTask: (taskId: number) => void;
};

const TaskChecklist = ({ tasks, onToggleTask }: TaskChecklistProps) => {
  return (
    <ul>
      {tasks.map((task) => (
        <li className='border-b border-gray-400/20 py-[1rem] last:border-b-0' key={task.id}>
          <CheckBox checked={task.completed} onChange={() => onToggleTask(task.id)}>
            <span className='flex min-w-0 flex-col gap-[0.2rem]'>
              <span
                className={cn(
                  'caption-14-md truncate',
                  task.completed ? 'text-gray-400 line-through' : 'text-black',
                )}
              >
                {task.title}
              </span>
              {task.completed && (
                <span className='caption-11-md text-gray-500'>
                  {`${task.completedBy} ${task.completedTime} 완료`}
                </span>
              )}
            </span>
          </CheckBox>
        </li>
      ))}
    </ul>
  );
};
