import { parseApiDate, type ApiJson } from './common';
import { WORKERS_MOCK } from './mock/workers';
import { getMonthlyUserIdsMock } from './mock/workApplications';
import { getMonthlyRecordMock } from './mock/workSchedules';

// 근로장학생 기본 정보. 아직 채우지 않은 정보는 null로 온다
export type Worker = {
  userId: number;
  name: string;
  studentId: string | null;
  department: string | null;
  grade: number | null;
  phoneNumber: string | null;
  // 로그인 아이디로 쓰는 학교 메일
  email: string | null;
  // 근로를 시작한 달의 1일
  workStartDate: Date;
};

// 한 달 근무 기록. 시간은 모두 분 단위다
export type MonthlyWorkRecord = {
  monthlyWorkedMinutes: number;
  monthlyLimitMinutes: number;
  lateCount: number;
  lateMinutes: number;
  totalChangeRequestCount: number;
  approvedChangeRequestCount: number;
};

export type MonthlyWorker = Worker & {
  monthlyRecord: MonthlyWorkRecord;
};

export type GetWorkersResponse = {
  workers: Worker[];
};

export type GetMonthlyWorkersRequest = {
  year: number;
  // 1~12
  month: number;
};

export type GetMonthlyWorkersResponse = {
  year: number;
  month: number;
  // 그 달 근로학생 (근로신청 때 고른 학생). 아직 정하지 않은 달은 빈 배열
  workers: MonthlyWorker[];
};

// 바꾼 항목만 보낸다. 비운 항목은 null로 보낸다. 이메일·근로 시작일은 바꿀 수 없다
export type UpdateWorkerRequest = {
  userId: number;
  name?: string;
  studentId?: string | null;
  department?: string | null;
  grade?: number | null;
  phoneNumber?: string | null;
};

export type UpdateWorkerResponse = Worker;

const toWorker = (json: ApiJson<Worker>): Worker => ({
  ...json,
  workStartDate: parseApiDate(json.workStartDate),
});

/**
 * GET /admin/workers
 * 같은 조직의 모든 근로장학생. 검색·선택 목록과 근로장학생 전체 탭에 쓴다 (이름 검색은 화면에서 한다)
 */
export const getWorkers = (): GetWorkersResponse => ({
  workers: WORKERS_MOCK.map(toWorker),
});

/**
 * GET /admin/workers/monthly?year=&month=
 * 그 달 근로학생과 그 달 근무 기록
 */
export const getMonthlyWorkers = ({
  year,
  month,
}: GetMonthlyWorkersRequest): GetMonthlyWorkersResponse => {
  const userIds = getMonthlyUserIdsMock(year, month);

  return {
    year,
    month,
    workers: WORKERS_MOCK.filter(({ userId }) => userIds.includes(userId)).map((json) => ({
      ...toWorker(json),
      monthlyRecord: getMonthlyRecordMock(json.userId, year, month),
    })),
  };
};

/**
 * PATCH /admin/workers/{userId}
 * body: userId를 뺀 나머지 (바꾼 항목만)
 */
export const updateWorker = ({ userId, ...changes }: UpdateWorkerRequest): UpdateWorkerResponse => {
  const index = WORKERS_MOCK.findIndex((worker) => worker.userId === userId);
  const current = WORKERS_MOCK[index];
  if (!current) throw new Error(`근로장학생(${userId})을 찾을 수 없습니다.`);

  const updated = { ...current, ...changes };
  WORKERS_MOCK[index] = updated;

  return toWorker(updated);
};
