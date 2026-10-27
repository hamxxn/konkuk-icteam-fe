import { useState } from 'react';

import {
  addDays,
  DAYS_PER_WEEK,
  getMondayOfWeek,
  getMonthWeekInfo,
  getWeekdayDates,
} from '@/shared/utils/week';

// 기준 날짜가 속한 달의 주차 안에서만 오간다.
// 두 달에 걸친 주는 목요일이 속한 달로 센다.
export const useTimeTableWeek = (baseDate: Date) => {
  // 지금 보고 있는 주의 월요일
  const [monday, setMonday] = useState(() => getMondayOfWeek(baseDate));
  const { year, month, week } = getMonthWeekInfo(monday);
  const baseMonth = getMonthWeekInfo(baseDate);

  const checkInBaseMonth = (targetMonday: Date) => {
    const target = getMonthWeekInfo(targetMonday);

    return target.year === baseMonth.year && target.month === baseMonth.month;
  };

  const isPrevWeekDisabled = !checkInBaseMonth(addDays(monday, -DAYS_PER_WEEK));
  const isNextWeekDisabled = !checkInBaseMonth(addDays(monday, DAYS_PER_WEEK));

  const handlePrevWeek = () => {
    if (isPrevWeekDisabled) return;

    setMonday((currentMonday) => addDays(currentMonday, -DAYS_PER_WEEK));
  };

  const handleNextWeek = () => {
    if (isNextWeekDisabled) return;

    setMonday((currentMonday) => addDays(currentMonday, DAYS_PER_WEEK));
  };

  return {
    year,
    month,
    week,
    dates: getWeekdayDates(monday),
    isPrevWeekDisabled,
    isNextWeekDisabled,
    handlePrevWeek,
    handleNextWeek,
  };
};
