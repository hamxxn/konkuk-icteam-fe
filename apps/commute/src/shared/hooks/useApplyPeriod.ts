import { useState } from 'react';
import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { formatDateKey, hasOpenApplyPeriod } from '@/shared/components/timetable/utils';

type ApplyPeriod = {
  applyStartDate: string | null;
  applyEndDate: string | null;
};

/**
 * 근로 신청 기간 목업을 만듭니다. 다음 달 신청 기간이 오늘을 포함하도록 열어 두어 신청·수정 흐름을 모두 확인할 수 있게 합니다.
 * @param target 대상 연월
 * @param target.year 연도
 * @param target.month 월 (1~12)
 * @param today 기준일
 * @returns 신청 기간 (YYYY-MM-DD). 다음 달이 아니면 비어 있다
 * @example const period = createApplyPeriodMock({ year: 2026, month: 11 }, new Date());
 */
//TODOS: 신청 기간 조회 API로 바꾸기
const createApplyPeriodMock = (
  { year, month }: { year: number; month: number },
  today: Date,
): ApplyPeriod => {
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const isNextMonth = nextMonth.getFullYear() === year && nextMonth.getMonth() + 1 === month;
  if (!isNextMonth) return { applyStartDate: null, applyEndDate: null };

  const applyStart = new Date(today);
  applyStart.setDate(today.getDate() - 3);
  const applyEnd = new Date(today);
  applyEnd.setDate(today.getDate() + 7);

  return { applyStartDate: toISO(applyStart), applyEndDate: toISO(applyEnd) };
};

// 다음 달 근로 신청 기간. 관리자가 기간을 열면 그 안에서 신청하고, 마감일까지 바꿀 수 있다.
export const useApplyPeriod = () => {
  const [today] = useState(() => new Date());
  const nextMonthFirstDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const year = nextMonthFirstDate.getFullYear();
  const month = nextMonthFirstDate.getMonth() + 1;
  const period = createApplyPeriodMock({ year, month }, today);
  // todo: 신청 설정 API(WorkApplicationSettings.maxConcurrentWorkers)로 교체
  const maxConcurrentWorkers = 4;

  return {
    year,
    month,
    isApplyOpen: hasOpenApplyPeriod(period, formatDateKey(today)),
    applyEndDate: period.applyEndDate,
    // 한 타임에 함께 배정되는 최대 인원. 관리자가 달마다 정한다
    maxConcurrentWorkers,
  };
};
