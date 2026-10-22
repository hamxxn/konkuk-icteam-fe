import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { useEffect, useState } from 'react';
import { checkClockInAvailable } from '../_lib';
import { WorkStatus, type HomeTodaySchedule, type WorkSchedule } from '../_types';
import { createMyDailySchedulesMock } from '../mock';

// 지금 시각을 다시 읽는 주기. 출근 가능 시간대에 들어서면 출근 버튼이 저절로 나타난다
const CURRENT_TIME_REFRESH_MS = 30_000;

const formatCheckInTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

// 고른 날의 근무 일정과 출근 상태를 관리한다. 출근하면 서버 대신 화면 상태만 바꾼다.
export const useAttendance = (selectedDate: string) => {
  // 목업을 만들 기준 시각. 오늘 목업은 지금 시각으로 근무를 만들어서, 처음 시각으로 고정해 둔다
  const [mockBaseDate] = useState(() => new Date());
  const [currentDate, setCurrentDate] = useState(mockBaseDate);
  // 출근 처리로 바뀐 날의 근무 일정 (날짜 → 근무 일정)
  const [updatedSchedules, setUpdatedSchedules] = useState<Record<string, HomeTodaySchedule[]>>({});

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), CURRENT_TIME_REFRESH_MS);

    return () => window.clearInterval(timer);
  }, []);

  //TODOS: API 호출로 고른 날의 근무 일정 가져오기. 지금은 목업으로 만든다
  const responseSchedules =
    updatedSchedules[selectedDate] ?? createMyDailySchedulesMock(selectedDate, mockBaseDate);
  const isToday = selectedDate === toISO(currentDate);

  // 출근은 오늘 근무에만 할 수 있다
  const schedules: WorkSchedule[] = responseSchedules.map((schedule) => ({
    ...schedule,
    canClockIn: isToday && checkClockInAvailable(schedule, currentDate),
  }));

  // 출근 버튼을 누른 근무를 근무중으로 바꾼다
  // 근무 시간대는 겹치지 않아서 시작 시각으로 근무를 찾는다
  //TODOS: 출근 API 호출. 요청에는 찾은 근무의 scheduleIds를 보낸다
  const handleClockIn = (start: string) => {
    const now = new Date();

    setUpdatedSchedules((prev) => ({
      ...prev,
      [selectedDate]: responseSchedules.map((schedule) =>
        schedule.start === start
          ? {
              ...schedule,
              checkedIn: true,
              checkInTime: formatCheckInTime(now),
              workStatusCode: WorkStatus.WORKING,
            }
          : schedule,
      ),
    }));
    setCurrentDate(now);
  };

  return { schedules, handleClockIn };
};
