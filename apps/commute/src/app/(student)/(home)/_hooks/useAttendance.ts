import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import { useEffect, useState } from 'react';
import { clockIn, getMyWorkShifts, type WorkShift } from '@/shared/apis/workShifts';
import { checkClockInAvailable } from '../_utils/checkClockInAvailable';
import type { WorkShiftView } from '../_types';

// 지금 시각을 다시 읽는 주기. 출근 가능 시간대에 들어서면 출근 버튼이 저절로 나타난다
const CURRENT_TIME_REFRESH_MS = 30_000;

// 고른 날의 내 근무와 출근 상태를 관리한다
export const useAttendance = (selectedDate: string) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  // 출근 처리로 바뀐 근무 (첫 배치 id → 근무). 다시 조회하지 않고 화면에 바로 반영한다
  const [clockedInShifts, setClockedInShifts] = useState<Record<number, WorkShift>>({});

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), CURRENT_TIME_REFRESH_MS);

    return () => window.clearInterval(timer);
  }, []);

  const { shifts: responseShifts } = getMyWorkShifts({ date: parseISO(selectedDate) });
  const isToday = selectedDate === toISO(currentDate);

  // 출근은 오늘 근무에만 할 수 있다
  const shifts: WorkShiftView[] = responseShifts.map((responseShift) => {
    const shift = clockedInShifts[responseShift.scheduleIds[0] ?? -1] ?? responseShift;

    return { ...shift, canClockIn: isToday && checkClockInAvailable(shift, currentDate) };
  });

  const handleClockIn = (shift: WorkShift) => {
    const updatedShift = clockIn({ scheduleIds: shift.scheduleIds });

    setClockedInShifts((prev) => ({ ...prev, [shift.scheduleIds[0] ?? -1]: updatedShift }));
    setCurrentDate(new Date());
  };

  return { shifts, handleClockIn };
};
