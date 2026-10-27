import {
  toWorkChangeRequest,
  type WorkChangeRequest,
  type WorkChangeRequestStatusCode,
} from '@/shared/apis/workChangeRequests';
import { getWorkChangeRequestsMock, updateWorkChangeRequestMock } from './mock/workChangeRequests';

// 근무 변경 요청 한 건의 모양은 근로학생 API(shared/apis/workChangeRequests)와 같다
export type {
  WorkChangeRequest,
  WorkChangeRequestStatusCode,
} from '@/shared/apis/workChangeRequests';

export type GetWorkChangeRequestsRequest = {
  year: number;
  // 1~12. 요청을 보낸 달 기준
  month: number;
};

export type WorkChangeRequestSummary = {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
};

export type GetWorkChangeRequestsResponse = {
  year: number;
  month: number;
  summary: WorkChangeRequestSummary;
  // 최근 요청이 앞
  requests: WorkChangeRequest[];
};

// 승인하면 서버가 삭제·추가 근무를 시간표에 반영한다. 반려할 때는 사유가 꼭 있어야 한다
export type UpdateWorkChangeRequestRequest =
  | { requestId: number; statusCode: 'CS02' }
  | { requestId: number; statusCode: 'CS03'; rejectReason: string };

export type UpdateWorkChangeRequestResponse = WorkChangeRequest;

/**
 * GET /admin/work-change-requests?year=&month=
 * 한 달 동안 들어온 근무 변경 요청과 상태별 건수. 대시보드는 summary.pendingCount만 쓴다
 */
export const getWorkChangeRequests = ({
  year,
  month,
}: GetWorkChangeRequestsRequest): GetWorkChangeRequestsResponse => {
  const requests = getWorkChangeRequestsMock(year, month).map(toWorkChangeRequest);
  const countByStatus = (statusCode: WorkChangeRequestStatusCode) =>
    requests.filter((request) => request.statusCode === statusCode).length;

  return {
    year,
    month,
    summary: {
      totalCount: requests.length,
      pendingCount: countByStatus('CS01'),
      approvedCount: countByStatus('CS02'),
      rejectedCount: countByStatus('CS03'),
    },
    requests,
  };
};

/**
 * PATCH /admin/work-change-requests/{requestId}
 * body: { statusCode, rejectReason? }. 승인 대기(CS01)인 요청만 처리할 수 있다
 */
export const updateWorkChangeRequest = (
  request: UpdateWorkChangeRequestRequest,
): UpdateWorkChangeRequestResponse =>
  toWorkChangeRequest(
    updateWorkChangeRequestMock(request.requestId, {
      statusCode: request.statusCode,
      rejectReason: request.statusCode === 'CS03' ? request.rejectReason : null,
    }),
  );
