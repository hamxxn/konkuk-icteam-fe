import { startOfMonth, toISO } from '@konkuk-icteam-fe/design-system/date';
import { useMemo, useState } from 'react';
import { createMyWorkDatesMock } from '../mock';

// 근무 달력에서 보고 있는 달과 고른 날짜를 관리한다. 처음에는 오늘이 속한 달과 오늘을 보여 준다.
export const useWorkCalendar = (today: Date) => {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(() => toISO(today));

  //TODOS: API 호출로 그 달의 근무 날짜 가져오기. 목업 계산이 무거워 달이 바뀔 때만 다시 만든다
  const workDates = useMemo(() => createMyWorkDatesMock(viewMonth, today), [viewMonth, today]);

  return {
    viewMonth,
    selectedDate,
    workDates,
    handleMonthChange: setViewMonth,
    handleSelectDate: setSelectedDate,
  };
};
