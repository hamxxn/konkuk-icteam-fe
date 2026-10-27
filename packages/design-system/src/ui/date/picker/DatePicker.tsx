'use client';

import { useMemo, useState } from 'react';
import { IconArrowLeft, IconArrowRight } from '@konkuk-icteam-fe/design-system/assets';
import IconButton from '../../button/icon-button/IconButton';
import DateCell from '../cell/DateCell';
import { WEEKDAY_LABELS } from './constants/date';
import { CalendarCell } from './types/calendarCell';
import { DatePickerProps } from './types/datePickerProps';
import {
  addMonths,
  compareISO,
  daysInMonth,
  formatNumber,
  parseISO,
  startOfMonth,
  toISO,
} from '@konkuk-icteam-fe/design-system/date';
import { createNextDateRange, getDateRangePosition } from './utils/date';

/**
 * 날짜 선택 컴포넌트
 * - 하루 선택(mode='single', 기본값), 기간 선택(mode='range'), 여러 날짜 선택(mode='multiple') 지원
 * - 여러 날짜 선택: 누를 때마다 그 날짜를 넣고 빼며, 고른 날짜는 날짜순으로 넘긴다
 * - 기간 선택: 첫 클릭이 시작일, 이후 클릭이 종료일. 시작일보다 이전이거나 사이에 disabledDates가 있으면 새 시작일로 다시 시작
 * - 월은 제어형/비제어형 모두 지원
 * - minDate/maxDate 범위와 disabledDates로 선택 가능한 날짜 제한 지원
 * - color로 선택된 날짜와 기간 띠의 색 변경 지원 (기본값 'black')
 * @param props DatePickerProps
 * @example
 * <DatePicker
 *   selectedDate="2024-01-15"
 *   handleDateChangeAction={(next) => console.log(next)}
 *   defaultViewDateMonth={new Date(2024, 0, 1)} // 2024년 1월
 *   minDate="2024-01-10"
 *   maxDate="2024-01-20"
 *   disabledDates={['2024-01-12']}
 * />
 * @example
 * <DatePicker
 *   mode="range"
 *   selectedRange={{ start: '2024-01-10', end: '2024-01-15' }}
 *   handleRangeChangeAction={(next) => console.log(next)}
 * />
 * @example
 * <DatePicker
 *   mode="multiple"
 *   selectedDates={['2024-01-10', '2024-01-12']}
 *   handleDatesChangeAction={(next) => console.log(next)}
 * />
 * @returns DatePicker 컴포넌트
 */
export default function DatePicker(props: DatePickerProps) {
  const {
    today,
    viewDateMonth: controlledViewMonth,
    defaultViewDateMonth,
    handleMonthChangeAction,
    maxDate,
    minDate,
    disablePastDates = true,
    disabledDates,
    color,
  } = props;
  const selectedDate =
    props.mode === 'range' || props.mode === 'multiple' ? undefined : props.selectedDate;
  const selectedDates = props.mode === 'multiple' ? (props.selectedDates ?? []) : undefined;
  const selectedRange = props.mode === 'range' ? props.selectedRange : undefined;

  // mode에 맞는 선택 값으로 그 날짜가 골라졌는지 확인한다
  const checkDateSelected = (iso: string) => {
    if (selectedDates) return selectedDates.includes(iso);
    if (selectedRange) return selectedRange.start === iso || selectedRange.end === iso;
    return selectedDate === iso;
  };

  const handleSelect = (iso: string) => {
    if (props.mode === 'range') {
      props.handleRangeChangeAction?.(createNextDateRange(props.selectedRange, iso, disabledDates));
      return;
    }
    if (props.mode === 'multiple') {
      const currentDates = props.selectedDates ?? [];
      props.handleDatesChangeAction?.(
        currentDates.includes(iso)
          ? currentDates.filter((date) => date !== iso)
          : [...currentDates, iso].sort(compareISO),
      );
      return;
    }
    props.handleDateChangeAction?.(iso);
  };

  // 월 상태 관리 (제어형/비제어형)
  const [uncontrolledMonth, setUncontrolledMonth] = useState(() =>
    startOfMonth(defaultViewDateMonth ?? new Date()),
  );
  // 헤더에 실제로 보여질 월
  const viewMonth = controlledViewMonth ?? uncontrolledMonth;
  // 오늘 날짜 ISO (YYYY-MM-DD, 비교용)
  const todayISO = toISO(today ?? new Date());
  const headerText = `${viewMonth.getFullYear()}.${formatNumber(viewMonth.getMonth() + 1)}`;

  const setMonth = (next: Date) => {
    if (!controlledViewMonth) setUncontrolledMonth(next);
    handleMonthChangeAction?.(next);
  };

  const firstSelectableMonth = useMemo(() => {
    if (minDate) return startOfMonth(parseISO(minDate));
    return disablePastDates ? startOfMonth(today ?? new Date()) : null;
  }, [minDate, disablePastDates, today]);
  const lastSelectableMonth = useMemo(
    () => (maxDate ? startOfMonth(parseISO(maxDate)) : null),
    [maxDate],
  );

  const viewMonthStart = startOfMonth(viewMonth);
  const isPrevMonthDisabled = !!firstSelectableMonth && viewMonthStart <= firstSelectableMonth;
  const isNextMonthDisabled = !!lastSelectableMonth && viewMonthStart >= lastSelectableMonth;

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    setMonth(addMonths(viewMonth, -1));
  };
  const handleNextMonth = () => {
    if (isNextMonthDisabled) return;
    setMonth(addMonths(viewMonth, 1));
  };

  const disabledDateSet = useMemo(() => new Set(disabledDates ?? []), [disabledDates]);

  const cells: CalendarCell[] = useMemo(() => {
    const year = viewMonth.getFullYear();
    const monthIndex = viewMonth.getMonth();
    const totalDays = daysInMonth(viewMonth);
    // 0~6 (일~토)
    const startDay = new Date(year, monthIndex, 1).getDay();

    // CellGrid 앞 빈칸 채우기 (이번 달 1일 앞에 오는 요일 수만큼)
    const prefixCells: CalendarCell[] = Array.from({ length: startDay }, (_, i) => ({
      kind: 'empty',
      key: `e-pre-${year}-${monthIndex}-${i}`,
    }));

    // 날짜
    const dayCells: CalendarCell[] = Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const iso = toISO(new Date(year, monthIndex, day));

      const isDisabled =
        (disablePastDates && compareISO(iso, todayISO) < 0) ||
        (!!minDate && compareISO(iso, minDate) < 0) ||
        (!!maxDate && compareISO(iso, maxDate) > 0) ||
        disabledDateSet.has(iso);

      return { kind: 'day', key: iso, day, iso, isDisabled };
    });

    // 전체 셀 배열 반환 = 앞빈칸 + 날짜칸
    return [...prefixCells, ...dayCells];
  }, [viewMonth, disablePastDates, todayISO, minDate, maxDate, disabledDateSet]);

  const cellRows = useMemo(
    () =>
      Array.from({ length: Math.ceil(cells.length / 7) }, (_, rowIndex) =>
        cells.slice(rowIndex * 7, rowIndex * 7 + 7),
      ),
    [cells],
  );

  const year = viewMonth.getFullYear();
  const monthNum = viewMonth.getMonth() + 1;

  return (
    <div className='flex flex-col'>
      {/* 이전, 다음 월 이동 */}
      <header className='flex flex-row items-center justify-between px-[1.6rem] py-[1.4rem]'>
        <IconButton
          className='text-gray-500'
          onClick={handlePrevMonth}
          disabled={isPrevMonthDisabled}
          aria-label='이전 달'
        >
          <IconArrowLeft className='h-[2.8rem] w-[2.8rem]' />
        </IconButton>
        <span className='font-18-bd text-black'>{headerText}</span>
        <IconButton
          className='text-gray-500'
          onClick={handleNextMonth}
          disabled={isNextMonthDisabled}
          aria-label='다음 달'
        >
          <IconArrowRight className='h-[2.8rem] w-[2.8rem]' />
        </IconButton>
      </header>

      <hr className='h-[0.1rem] w-full border-0 bg-gray-50' />

      {/* 그리드 달력*/}
      <div role='grid' aria-label={`${year}년 ${monthNum}월 달력`} className='flex flex-col'>
        {/* 달력 헤더 (요일) */}
        <div role='row' className='grid grid-cols-7 px-[1.6rem] py-[1rem]'>
          {WEEKDAY_LABELS.map((label) => (
            <span
              key={label}
              role='columnheader'
              className='caption-14-md py-[0.4rem] text-center text-gray-500'
            >
              {label}
            </span>
          ))}
        </div>
        {/* 달력 각 셀 */}
        <div className='flex flex-col gap-y-[0.8rem] px-[1.6rem]'>
          {cellRows.map((row) => (
            // 각 행은 cells를 7개씩 나눈 것이라, 첫 칸의 key가 그 행의 고유값이 된다
            <div key={row[0]?.key} role='row' className='grid grid-cols-7 place-items-center'>
              {row.map((cell) =>
                cell.kind === 'day' ? (
                  <DateCell
                    key={cell.key}
                    value={String(cell.day)}
                    iso={cell.iso}
                    isDisabled={cell.isDisabled}
                    isSelected={checkDateSelected(cell.iso)}
                    rangePosition={getDateRangePosition(cell.iso, selectedRange)}
                    isToday={cell.iso === todayISO}
                    color={color}
                    handleSelect={() => handleSelect(cell.iso)}
                  />
                ) : (
                  <div key={cell.key} aria-disabled='true' className='min-w-[3.2rem] py-[0.8rem]' />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
