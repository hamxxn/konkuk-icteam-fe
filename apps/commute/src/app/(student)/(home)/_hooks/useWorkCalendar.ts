import { startOfMonth, toISO } from '@konkuk-icteam-fe/design-system/date';
import { useMemo, useState } from 'react';
import { getMyWorkDates } from '@/app/(student)/_apis/workShifts';

// 근무 달력에서 보고 있는 달과 고른 날짜를 관리한다. 처음에는 오늘이 속한 달과 오늘을 보여 준다.
export const useWorkCalendar = (today: Date) => {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(() => toISO(today));

  // 달이 바뀔 때만 다시 조회한다. 달력과는 YYYY-MM-DD 글자로 주고받는다
  const workDates = useMemo(
    () =>
      getMyWorkDates({ year: viewMonth.getFullYear(), month: viewMonth.getMonth() + 1 }).dates.map(
        toISO,
      ),
    [viewMonth],
  );

  return {
    viewMonth,
    selectedDate,
    workDates,
    handleMonthChange: setViewMonth,
    handleSelectDate: setSelectedDate,
  };
};
