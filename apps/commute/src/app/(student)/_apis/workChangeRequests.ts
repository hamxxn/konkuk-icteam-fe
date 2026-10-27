import {
  parseApiDate,
  parseApiDateTime,
  toApiDate,
  toApiDateTime,
  type ApiJson,
  type WorkTimeRange,
} from './common';
import { getMyNameMock, MY_USER_ID } from './mock/me';
import { addWorkChangeRequestMock, getWorkChangeRequestsMock } from './mock/workChangeRequests';

// 관리자 근무 변경 요청(GET /admin/work-change-requests)과 같은 모양이다

// CS01 승인 대기 · CS02 승인 · CS03 반려
export type WorkChangeRequestStatusCode = 'CS01' | 'CS02' | 'CS03';

// 내가 보낸 근무 변경 요청 한 건. 뺄 근무와 더할 근무 중 한쪽만 있을 수도 있다
export type WorkChangeRequest = {
  requestId: number;
  userId: number;
  userName: string;
  statusCode: WorkChangeRequestStatusCode;
  requestedAt: Date;
  reason: string;
  // 반려한 요청에만 있다
  rejectReason: string | null;
  deleteSchedules: WorkTimeRange[];
  addSchedules: WorkTimeRange[];
};

export type GetMyWorkChangeRequestsRequest = {
  year: number;
  // 1~12. 요청을 보낸 달 기준
  month: number;
};

export type GetMyWorkChangeRequestsResponse = {
  year: number;
  month: number;
  // 최근 요청이 앞
  requests: WorkChangeRequest[];
};

// 관리자가 승인해야 시간표에 반영된다. 사유는 꼭 있어야 한다
export type CreateWorkChangeRequestRequest = {
  reason: string;
  deleteSchedules: WorkTimeRange[];
  addSchedules: WorkTimeRange[];
};

export type CreateWorkChangeRequestResponse = WorkChangeRequest;

const toWorkTimeRange = (json: ApiJson<WorkTimeRange>): WorkTimeRange => ({
  ...json,
  date: parseApiDate(json.date),
});

const toWorkTimeRangeJson = (range: WorkTimeRange): ApiJson<WorkTimeRange> => ({
  ...range,
  date: toApiDate(range.date),
});

// 응답 JSON을 날짜가 Date인 요청으로 바꾼다. 관리자 API도 같은 모양이라 함께 쓴다
export const toWorkChangeRequest = (json: ApiJson<WorkChangeRequest>): WorkChangeRequest => ({
  ...json,
  requestedAt: parseApiDateTime(json.requestedAt),
  deleteSchedules: json.deleteSchedules.map(toWorkTimeRange),
  addSchedules: json.addSchedules.map(toWorkTimeRange),
});

/**
 * GET /me/work-change-requests?year=&month=
 * 그 달 내가 보낸 근무 변경 요청. 한 달 요청 횟수를 셀 때도 쓴다
 */
export const getMyWorkChangeRequests = ({
  year,
  month,
}: GetMyWorkChangeRequestsRequest): GetMyWorkChangeRequestsResponse => ({
  year,
  month,
  requests: getWorkChangeRequestsMock(year, month)
    .filter(({ userId }) => userId === MY_USER_ID)
    .map(toWorkChangeRequest),
});

/**
 * POST /me/work-change-requests
 * body: { reason, deleteSchedules, addSchedules }. 만든 요청(승인 대기)을 돌려준다
 */
export const createWorkChangeRequest = ({
  reason,
  deleteSchedules,
  addSchedules,
}: CreateWorkChangeRequestRequest): CreateWorkChangeRequestResponse =>
  toWorkChangeRequest(
    addWorkChangeRequestMock({
      userId: MY_USER_ID,
      userName: getMyNameMock(),
      requestedAt: toApiDateTime(new Date()),
      reason,
      deleteSchedules: deleteSchedules.map(toWorkTimeRangeJson),
      addSchedules: addSchedules.map(toWorkTimeRangeJson),
    }),
  );
