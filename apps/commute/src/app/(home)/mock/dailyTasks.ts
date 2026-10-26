import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { TaskPeriod, type TaskItem } from '../_types';
import { MY_USER_ID, WORKERS_MOCK } from './workers';

// 오전·오후 업무 목록. 날짜와 관계없이 같다
const TASK_TITLES: Record<TaskPeriod, { id: number; title: string }[]> = {
  [TaskPeriod.MORNING]: [
    { id: 1, title: '사무실 문 열기 및 PC 전원 켜기' },
    { id: 2, title: '전날 접수된 문의 메일 확인' },
    { id: 3, title: '프린터 용지 및 토너 확인' },
  ],
  [TaskPeriod.AFTERNOON]: [
    { id: 4, title: '장비 대여 대장 정리' },
    { id: 5, title: '회의실 예약 현황 확인' },
    { id: 6, title: '퇴근 전 사무실 소등 및 문단속' },
  ],
};

// 업무를 나눠 체크하는 동료들 (나를 뺀 근로학생)
const COWORKER_NAMES = WORKERS_MOCK.filter(({ userId }) => userId !== MY_USER_ID).map(
  ({ name }) => name,
);

const PERIOD_START_HOUR: Record<TaskPeriod, number> = {
  [TaskPeriod.MORNING]: 9,
  [TaskPeriod.AFTERNOON]: 13,
};

/**
 * 하루치 오전·오후 업무 목업을 만듭니다. 지난 날은 동료들이 모두 체크해 두었고,
 * 오늘은 오전·오후 업무의 첫 건만 동료가 체크해 둔 상태입니다.
 * @param date 날짜 (YYYY-MM-DD)
 * @param today 기준일 (오늘)
 * @returns 오전·오후별 업무 목록
 * @example const tasks = createDailyTasksMock('2026-10-20', new Date());
 */
export const createDailyTasksMock = (date: string, today: Date): Record<TaskPeriod, TaskItem[]> => {
  const todayDate = toISO(today);

  const createTasks = (period: TaskPeriod) =>
    TASK_TITLES[period].map(({ id, title }, index): TaskItem => {
      const completed = date < todayDate || (date === todayDate && index === 0);

      return completed
        ? {
            id,
            title,
            completed,
            completedBy: COWORKER_NAMES[index % COWORKER_NAMES.length],
            completedTime: `${String(PERIOD_START_HOUR[period]).padStart(2, '0')}:${String(index * 7 + 5).padStart(2, '0')}`,
          }
        : { id, title, completed };
    });

  return {
    [TaskPeriod.MORNING]: createTasks(TaskPeriod.MORNING),
    [TaskPeriod.AFTERNOON]: createTasks(TaskPeriod.AFTERNOON),
  };
};
