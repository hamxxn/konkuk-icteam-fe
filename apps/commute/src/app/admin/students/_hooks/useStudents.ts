import { useCallback, useReducer, useState } from 'react';
import {
  getMonthlyWorkers,
  getWorkers,
  updateWorker,
  type MonthlyWorkRecord,
  type Worker,
} from '../../_apis/workers';
import { getCurrentMonthKey, parseMonthKey, shiftMonthKey } from '../../_lib/monthKey';
import { STUDENT_PAGE_SIZE } from '../_constants/student';
import type { StudentTab } from '../_lib/studentTab';

// 근로장학생 표 한 줄. 이번 달 근로학생이면 이번 달 근무 기록이 붙는다
export type StudentRow = Worker & {
  isCurrentMonthWorker: boolean;
  monthlyRecord: MonthlyWorkRecord | null;
};

// 정보 수정에서 바꿀 수 있는 항목
const EDITABLE_KEYS = ['name', 'studentId', 'department', 'grade', 'phoneNumber'] as const;

// 지난 달은 1년 전까지 돌아볼 수 있고, 앞으로는 신청을 연 다음 달까지 볼 수 있다
const MIN_MONTH_OFFSET = -12;
const MAX_MONTH_OFFSET = 1;

// 근로장학생 목록. 월별 탭은 그 달 근로학생만, 전체 탭은 모든 근로장학생을 보여 준다
export const useStudents = (tab: StudentTab) => {
  const [currentMonthKey] = useState(getCurrentMonthKey);
  const [monthOffset, setMonthOffset] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  // 정보를 고친 뒤 다시 불러오게 한다
  const [, refresh] = useReducer((count: number) => count + 1, 0);

  const monthKey = shiftMonthKey(currentMonthKey, monthOffset);
  // 이번 달 근무 기록은 어느 탭에서든 이번 달 근로학생에게 붙인다
  const currentRecords = new Map(
    getMonthlyWorkers(parseMonthKey(currentMonthKey)).workers.map(({ userId, monthlyRecord }) => [
      userId,
      monthlyRecord,
    ]),
  );
  const toRow = (worker: Worker): StudentRow => ({
    ...worker,
    isCurrentMonthWorker: currentRecords.has(worker.userId),
    monthlyRecord: currentRecords.get(worker.userId) ?? null,
  });

  const allStudents = getWorkers().workers.map(toRow);
  const tabStudents =
    tab === 'MONTHLY' ? getMonthlyWorkers(parseMonthKey(monthKey)).workers.map(toRow) : allStudents;
  const students = tabStudents.filter(({ name }) => name.includes(keyword.trim()));
  const totalPages = Math.max(Math.ceil(students.length / STUDENT_PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages - 1);

  // 상세 화면이 Escape 키 이벤트에 걸어 두므로, 그릴 때마다 새 함수가 되지 않게 고정한다
  const handleDetailClose = useCallback(() => setSelectedUserId(null), []);

  // 보는 범위가 바뀌면 결과가 통째로 달라지므로 첫 페이지로 되돌린다
  const handleTabChange = () => {
    setPage(0);
  };

  const handleMonthMove = (delta: number) => {
    setMonthOffset((prev) => Math.min(Math.max(prev + delta, MIN_MONTH_OFFSET), MAX_MONTH_OFFSET));
    setPage(0);
  };

  const handleKeywordChange = (nextKeyword: string) => {
    setKeyword(nextKeyword);
    setPage(0);
  };

  // 바뀐 항목만 보낸다
  const handleProfileUpdate = (profile: Worker) => {
    const current = allStudents.find(({ userId }) => userId === profile.userId);
    const changes = Object.fromEntries(
      EDITABLE_KEYS.filter((key) => profile[key] !== current?.[key]).map((key) => [
        key,
        profile[key],
      ]),
    );

    updateWorker({ userId: profile.userId, ...changes });
    refresh();
  };

  return {
    tab,
    monthKey,
    isCurrentMonth: monthOffset === 0,
    isPrevMonthDisabled: monthOffset <= MIN_MONTH_OFFSET,
    isNextMonthDisabled: monthOffset >= MAX_MONTH_OFFSET,
    keyword,
    students: students.slice(
      currentPage * STUDENT_PAGE_SIZE,
      (currentPage + 1) * STUDENT_PAGE_SIZE,
    ),
    totalCount: students.length,
    page: currentPage,
    totalPages,
    startNumber: currentPage * STUDENT_PAGE_SIZE,
    selectedStudent: allStudents.find(({ userId }) => userId === selectedUserId) ?? null,
    handleTabChange,
    handleMonthMove,
    handleKeywordChange,
    handlePageChange: setPage,
    handleDetailOpen: setSelectedUserId,
    handleDetailClose,
    handleProfileUpdate,
  };
};
