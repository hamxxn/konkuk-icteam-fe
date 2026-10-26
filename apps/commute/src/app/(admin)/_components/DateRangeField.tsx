'use client';

import { useRef, useState } from 'react';
import { IconArrowDown } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import { DatePicker, type DateRange } from '@konkuk-icteam-fe/design-system/ui';
import { formatDateRange } from '@/shared/utils/formatDate';

type DateRangeFieldProps = {
  startDate: string;
  endDate: string;
  disabled?: boolean;
  // 아직 기간을 고르지 않았을 때 보이는 글자
  placeholder?: string;
  // 오늘 이전 날짜를 못 고르게 할지
  disablePastDates?: boolean;
  onChange: (startDate: string, endDate: string) => void;
};

// 기간(시작일~마감일) 입력칸. 누르면 달력이 열리고, 시작일과 마감일을 차례로 누르면 저장하고 닫는다
export default function DateRangeField({
  startDate,
  endDate,
  disabled = false,
  placeholder = '기간을 골라 주세요',
  disablePastDates = false,
  onChange,
}: DateRangeFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  // 시작일만 고른 상태. 마감일까지 골라야 저장한다
  const [draftRange, setDraftRange] = useState<DateRange | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    setDraftRange(null);
  };

  const handleRangeChange = (nextRange: DateRange) => {
    if (!nextRange.start || !nextRange.end) {
      setDraftRange(nextRange);
      return;
    }
    onChange(nextRange.start, nextRange.end);
    handleClose();
  };

  return (
    <div
      ref={rootRef}
      className='relative'
      // 입력칸·달력 바깥으로 초점이 나가면 닫는다
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) handleClose();
      }}
    >
      <button
        type='button'
        disabled={disabled}
        aria-expanded={isOpen}
        className={cn(
          'bg-black-1 caption-14-md flex h-[4.2rem] w-full cursor-pointer items-center justify-between rounded-[0.6rem] border border-gray-400 px-[1.2rem] text-left text-black disabled:cursor-not-allowed disabled:text-gray-400',
          isOpen && 'border-black',
        )}
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
      >
        <span>{startDate && endDate ? formatDateRange(startDate, endDate) : placeholder}</span>
        <IconArrowDown aria-hidden className='h-[2.4rem] w-[2.4rem] shrink-0 text-gray-500' />
      </button>

      {isOpen ? (
        <div className='bg-black-1 absolute top-[calc(100%+0.5rem)] left-0 z-30 w-[32rem] rounded-[1.2rem] pb-[1.2rem] shadow-[0_0_12px_0_rgba(69,66,90,0.14)]'>
          <DatePicker
            mode='range'
            color='blue'
            disablePastDates={disablePastDates}
            defaultViewDateMonth={startDate ? parseISO(startDate) : undefined}
            selectedRange={draftRange ?? { start: startDate, end: endDate }}
            handleRangeChangeAction={handleRangeChange}
          />
        </div>
      ) : null}
    </div>
  );
}
