'use client';

import { DatePicker } from '@konkuk-icteam-fe/design-system/ui';
import { useState } from 'react';
import { getMonthDates } from '@/shared/utils/calendar';
import { useAttendance, useWorkCalendar } from '../_hooks';
import WorkScheduleCard from './WorkScheduleCard';

// 근무 달력과 고른 날의 근무 일정. 근무중인 근무를 펼치면 업무 사항이 보이고, 지금 출근할 근무에는 출근 버튼이 붙는다
export default function ScheduleSection() {
  const [today] = useState(() => new Date());

  const { viewMonth, selectedDate, workDates, handleMonthChange, handleSelectDate } =
    useWorkCalendar(today);
  const { shifts, handleClockIn } = useAttendance(selectedDate);

  const nonWorkDates = getMonthDates(viewMonth).filter((date) => !workDates.includes(date));

  return (
    <section className='flex flex-col gap-[1.6rem]'>
      <section className='rounded-[0.6rem] border border-gray-50 pb-[1.6rem]'>
        <DatePicker
          today={today}
          viewDateMonth={viewMonth}
          selectedDate={selectedDate}
          disabledDates={nonWorkDates}
          disablePastDates={false}
          color='black'
          handleMonthChangeAction={handleMonthChange}
          handleDateChangeAction={handleSelectDate}
        />
      </section>
      <WorkScheduleCard shifts={shifts} date={selectedDate} onClockIn={handleClockIn} />
    </section>
  );
}
