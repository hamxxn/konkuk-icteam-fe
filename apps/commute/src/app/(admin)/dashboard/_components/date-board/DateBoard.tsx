'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { IconArrowDown } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { DatePicker } from '@konkuk-icteam-fe/design-system/ui';
import WorkScheduleList from './WorkScheduleList';
import { formatMonthDayWithWeekday } from '@/shared/utils/formatDate';
import { useWorkSchedule } from '../../_hooks/useWorkSchedule';
import { getWorkersByPeriod } from '../../_utils/getWorkersByPeriod';
import AssignTaskList from './AssignTaskList';

// 그날 하루를 보는 카드. 근무 시간표는 직접 불러온다. 맨 위 날짜를 바꾸면 아래 근무 시간표와 업무 지정이 함께 바뀐다.
type DateBoardProps = {
  // 업무를 추가·수정·삭제한 뒤 알릴 글자
  onNotify: (message: string) => void;
};

export default function DateBoard({ onNotify }: DateBoardProps) {
  // 처음에는 오늘을 본다
  const [selectedDateKey, setSelectedDateKey] = useState(() => toISO(new Date()));
  const { slots } = useWorkSchedule(selectedDateKey);
  const headingId = useId();
  const calendarId = useId();
  const calendarAreaRef = useRef<HTMLDivElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 달력 바깥을 누르거나 Escape를 누르면 닫는다
  useEffect(() => {
    if (!isCalendarOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!calendarAreaRef.current?.contains(event.target as Node)) setIsCalendarOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCalendarOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCalendarOpen]);

  const handleDateSelect = (dateKey: string) => {
    setSelectedDateKey(dateKey);
    setIsCalendarOpen(false);
  };

  return (
    <section aria-labelledby={headingId} className='rounded-[1.2rem] border border-gray-50'>
      <div className='relative flex items-center justify-center gap-[1.6rem] border-b border-gray-50 px-[2.1rem] py-[1.6rem]'>
        <div ref={calendarAreaRef} className='relative'>
          <button
            type='button'
            aria-expanded={isCalendarOpen}
            aria-controls={calendarId}
            aria-haspopup='dialog'
            className='hover:text-blue flex min-w-[24rem] cursor-pointer items-center justify-center gap-[0.4rem] text-black'
            onClick={() => setIsCalendarOpen((prev) => !prev)}
          >
            <h2 id={headingId} className='title-20-bd'>
              {formatMonthDayWithWeekday(selectedDateKey)}
            </h2>
            <IconArrowDown
              aria-hidden
              className={cn(
                'h-[2rem] w-[2rem] text-gray-500 transition-transform duration-300',
                isCalendarOpen && 'rotate-180',
              )}
            />
          </button>
          {isCalendarOpen ? (
            <div
              id={calendarId}
              role='dialog'
              aria-label='날짜 고르기'
              className='bg-black-1 animate-nav-rise absolute top-[calc(100%+1.2rem)] left-1/2 z-30 w-[36rem] -translate-x-1/2 rounded-[1.2rem] p-[1.2rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)] motion-reduce:animate-none'
            >
              <DatePicker
                selectedDate={selectedDateKey}
                // 지난 날의 근태를 돌아보는 화면이라, 기본으로 막혀 있는 지난 날짜를 연다
                disablePastDates={false}
                color='blue'
                handleDateChangeAction={handleDateSelect}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className='grid grid-cols-2 divide-x divide-gray-50'>
        <div className='px-[2.1rem] py-[1.6rem]'>
          <h3 className='font-16-bd mb-[2rem] text-black'>근무 시간표</h3>
          <WorkScheduleList slots={slots} />
        </div>
        <div className='px-[2.1rem] py-[1.6rem]'>
          <h3 className='font-16-bd mb-[2rem] text-black'>업무 지정</h3>
          <AssignTaskList
            dateKey={selectedDateKey}
            workersByPeriod={getWorkersByPeriod(slots)}
            onNotify={onNotify}
          />
        </div>
      </div>
    </section>
  );
}
