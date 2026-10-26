import { useReducer } from 'react';
import { getWorkChangeRequests, updateWorkChangeRequest } from '../../../_apis/workChangeRequests';

// 한 달치 근무 변경 요청과 승인·반려 처리. 처리하면 바로 저장하고 다시 불러온다
export const useWorkChangeRequests = (year: number, month: number) => {
  const [, refresh] = useReducer((count: number) => count + 1, 0);
  const { summary, requests } = getWorkChangeRequests({ year, month });

  const handleApprove = (requestId: number) => {
    updateWorkChangeRequest({ requestId, statusCode: 'CS02' });
    refresh();
  };

  const handleReject = (requestId: number, rejectReason: string) => {
    updateWorkChangeRequest({ requestId, statusCode: 'CS03', rejectReason });
    refresh();
  };

  return { summary, requests, handleApprove, handleReject };
};
