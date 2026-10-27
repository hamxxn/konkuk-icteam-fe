import { parseApiDate, toApiDate } from './common';
import { getMyWorkRecordMock } from './mock/workRecords';

// 내 근무 기록. 시간은 관리자 근무 기록(MonthlyWorkRecord)처럼 분 단위다
export type GetMyWorkRecordRequest = {
  // 이 날이 속한 주·달을 센다
  date: Date;
};

export type GetMyWorkRecordResponse = {
  date: Date;
  // 그 주(월~일)와 그 달에 근무한 시간 (분)
  weeklyWorkedMinutes: number;
  monthlyWorkedMinutes: number;
};

/**
 * GET /me/work-records?date=
 * 그 주·그 달 근무한 시간
 */
export const getMyWorkRecord = ({ date }: GetMyWorkRecordRequest): GetMyWorkRecordResponse => {
  const dateKey = toApiDate(date);

  return { date: parseApiDate(dateKey), ...getMyWorkRecordMock(dateKey) };
};
