import { formatNumber } from '@konkuk-icteam-fe/design-system/date';
import type { ApiJson } from '@/shared/apis/common';
import type { WorkChangeRequest } from '../workChangeRequests';

type ProcessedResult = Pick<WorkChangeRequest, 'statusCode' | 'rejectReason'>;

// 관리자가 승인·반려한 결과 (요청 id → 결과). 새로 고침하면 처음으로 돌아간다
const PROCESSED_RESULTS: Record<number, ProcessedResult> = {};

// 근로학생 화면에서 새로 보낸 요청. 새로 고침하면 처음으로 돌아간다
const ADDED_REQUESTS: ApiJson<WorkChangeRequest>[] = [];

/**
 * 한 달치 근무 변경 요청 목업을 만듭니다. 날짜는 그 달 안에서만 씁니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 근무 변경 요청 목록 (최근 요청이 앞)
 * @example createBaseRequestsMock(2026, 10).length; // 6
 */
const createBaseRequestsMock = (year: number, month: number): ApiJson<WorkChangeRequest>[] => {
  const createDate = (day: number) => `${year}-${formatNumber(month)}-${formatNumber(day)}`;
  const createId = (order: number) => year * 10000 + month * 100 + order;

  return [
    {
      requestId: createId(6),
      userId: 1,
      userName: '홍길동',
      statusCode: 'CS01',
      requestedAt: `${createDate(22)}T10:12:00`,
      reason: '전공 수업 보강이 잡혀서 오전 근무를 오후로 옮기고 싶습니다.',
      rejectReason: null,
      deleteSchedules: [{ date: createDate(27), start: '09:00', end: '12:00' }],
      addSchedules: [
        { date: createDate(28), start: '13:00', end: '16:00' },
        { date: createDate(23), start: '10:00', end: '11:00' },
      ],
    },
    {
      requestId: createId(5),
      userId: 5,
      userName: '최유나',
      statusCode: 'CS01',
      requestedAt: `${createDate(21)}T15:40:00`,
      reason: '이번 주 근무 시간이 부족해서 추가 근무를 신청합니다.',
      rejectReason: null,
      deleteSchedules: [],
      addSchedules: [{ date: createDate(24), start: '14:00', end: '17:00' }],
    },
    {
      requestId: createId(4),
      userId: 6,
      userName: '정하준',
      statusCode: 'CS01',
      requestedAt: `${createDate(20)}T09:05:00`,
      reason: '시험 기간이라 이틀 근무를 빼고 싶습니다.',
      rejectReason: null,
      deleteSchedules: [
        { date: createDate(25), start: '11:00', end: '13:00' },
        { date: createDate(26), start: '15:00', end: '18:00' },
      ],
      addSchedules: [],
    },
    {
      requestId: createId(3),
      userId: 2,
      userName: '김민지',
      statusCode: 'CS02',
      requestedAt: `${createDate(14)}T11:20:00`,
      reason: '병원 진료가 있어 근무 시간을 바꾸고 싶습니다.',
      rejectReason: null,
      deleteSchedules: [{ date: createDate(16), start: '10:00', end: '12:00' }],
      addSchedules: [{ date: createDate(17), start: '10:00', end: '12:00' }],
    },
    {
      requestId: createId(2),
      userId: 3,
      userName: '이서준',
      statusCode: 'CS03',
      requestedAt: `${createDate(10)}T17:45:00`,
      reason: '동아리 행사 준비로 금요일 근무를 빼고 싶습니다.',
      rejectReason: '해당 시간에 근무 인원이 부족해 바꾸기 어렵습니다.',
      deleteSchedules: [{ date: createDate(13), start: '13:00', end: '17:00' }],
      addSchedules: [],
    },
    {
      requestId: createId(1),
      userId: 7,
      userName: '강서연',
      statusCode: 'CS02',
      requestedAt: `${createDate(3)}T08:55:00`,
      reason: '처음 배정된 시간이 수업과 겹칩니다.',
      rejectReason: null,
      deleteSchedules: [{ date: createDate(6), start: '09:00', end: '11:00' }],
      addSchedules: [{ date: createDate(6), start: '15:00', end: '17:00' }],
    },
  ];
};

export const getWorkChangeRequestsMock = (year: number, month: number) => {
  const monthPrefix = `${year}-${formatNumber(month)}`;
  const addedRequests = ADDED_REQUESTS.filter(({ requestedAt }) =>
    requestedAt.startsWith(monthPrefix),
  ).reverse();

  return [...addedRequests, ...createBaseRequestsMock(year, month)].map((request) => ({
    ...request,
    ...PROCESSED_RESULTS[request.requestId],
  }));
};

/**
 * 근로학생이 보낸 근무 변경 요청을 승인 대기로 넣습니다. 요청 id는 년·월 뒤에 기본 목업 다음 순번을 붙입니다.
 * @param request 요청 id·상태를 뺀 요청 JSON
 * @returns 넣은 요청 JSON
 * @example addWorkChangeRequestMock({ userId: 1, userName: '홍길동', requestedAt: '2026-10-27T10:00:00', reason: '...', deleteSchedules: [], addSchedules: [] });
 */
export const addWorkChangeRequestMock = (
  request: Omit<ApiJson<WorkChangeRequest>, 'requestId' | 'statusCode' | 'rejectReason'>,
) => {
  const year = Number(request.requestedAt.slice(0, 4));
  const month = Number(request.requestedAt.slice(5, 7));
  const order = getWorkChangeRequestsMock(year, month).length + 1;
  const added: ApiJson<WorkChangeRequest> = {
    ...request,
    requestId: year * 10000 + month * 100 + order,
    statusCode: 'CS01',
    rejectReason: null,
  };
  ADDED_REQUESTS.push(added);

  return added;
};

export const updateWorkChangeRequestMock = (requestId: number, result: ProcessedResult) => {
  PROCESSED_RESULTS[requestId] = result;

  // 요청 id는 년·월·순번으로 만들어서 거꾸로 달을 알 수 있다
  const year = Math.floor(requestId / 10000);
  const month = Math.floor(requestId / 100) % 100;
  const request = getWorkChangeRequestsMock(year, month).find(
    (item) => item.requestId === requestId,
  );
  if (!request) throw new Error(`근무 변경 요청(${requestId})을 찾을 수 없습니다.`);

  return request;
};
