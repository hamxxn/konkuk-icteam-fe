import type { WorkChangeRequestStatusCode } from '../../../_apis/workChangeRequests';

// 처리 상태 탭. 주소의 ?status= 값이고, 전체가 기본이다
export type StatusFilter = 'ALL' | WorkChangeRequestStatusCode;

const STATUS_FILTER_VALUES: StatusFilter[] = ['ALL', 'CS01', 'CS02', 'CS03'];

/**
 * 주소의 status 값을 처리 상태 탭으로 바꿉니다. 모르는 값이면 전체입니다.
 * @param value 주소의 status 값
 * @returns 처리 상태 탭
 * @example parseStatusFilter('CS01'); // 'CS01'
 */
export const parseStatusFilter = (value: unknown): StatusFilter =>
  STATUS_FILTER_VALUES.find((filter) => filter === value) ?? 'ALL';
