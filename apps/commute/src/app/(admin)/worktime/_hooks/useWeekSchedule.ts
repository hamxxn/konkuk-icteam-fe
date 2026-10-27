import { useReducer } from 'react';
import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import {
  createWorkSchedule,
  deleteWorkSchedule,
  getWorkSchedules,
  type WorkScheduleUser,
} from '../../_apis/workSchedules';
import { getWeekDays, type WeekDay } from '../_utils/weekKey';

// 칸에 넣을 사람. 배치 id는 넣은 뒤에 서버가 정한다
export type ScheduleCellWorker = Pick<WorkScheduleUser, 'userId' | 'userName'>;

export type ScheduleCell = {
  dateKey: string;
  start: string;
  end: string;
  users: WorkScheduleUser[];
};

// 시간표 한 열 (하루). 요일·날짜 글자와 30분 단위 칸
export type ScheduleDay = WeekDay & { cells: ScheduleCell[] };

// 한 주(월~금)의 30분 단위 근무 칸. 사람을 넣고 빼면 바로 저장하고 다시 불러온다
export const useWeekSchedule = (weekStartKey: string) => {
  const [, refresh] = useReducer((count: number) => count + 1, 0);

  const weekDays = getWeekDays(weekStartKey);
  const response = getWorkSchedules({
    startDate: parseISO(weekStartKey),
    endDate: parseISO(weekDays[weekDays.length - 1]?.dateKey ?? weekStartKey),
  });
  const days: ScheduleDay[] = weekDays.map((day, index) => ({
    ...day,
    cells: (response.days[index]?.slots ?? []).map(({ start, end, users }) => ({
      dateKey: day.dateKey,
      start,
      end,
      users,
    })),
  }));

  // 칸에 사람을 넣는다. 이미 그 칸에 있으면 넣지 않고 false를 돌려준다
  const handleUserAdd = (cell: ScheduleCell, { userId }: ScheduleCellWorker) => {
    if (cell.users.some((user) => user.userId === userId)) return false;

    createWorkSchedule({ userId, date: parseISO(cell.dateKey), start: cell.start, end: cell.end });
    refresh();
    return true;
  };

  const handleUserRemove = (scheduleId: number) => {
    deleteWorkSchedule({ scheduleId });
    refresh();
  };

  return {
    days,
    maxConcurrentWorkers: response.maxConcurrentWorkers,
    handleUserAdd,
    handleUserRemove,
  };
};
