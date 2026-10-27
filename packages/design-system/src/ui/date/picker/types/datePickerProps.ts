import { DateColor } from '../../cell/constants/color';
import { DateRange } from './dateRange';

// DatePicker가 받는 props. mode에 따라 고르는 값과 바뀔 때 부르는 함수가 달라진다
type DatePickerBaseProps = {
  // 오늘 날짜 (기본값: new Date())
  today?: Date;
  // 제어형 월 초기값
  viewDateMonth?: Date;
  // 제어형이 아닐 때 월 초기값
  defaultViewDateMonth?: Date;
  handleMonthChangeAction?: (nextMonth: Date) => void;
  minDate?: string;
  maxDate?: string;
  // 선택할 수 없는 날짜 목록 (YYYY-MM-DD)
  disabledDates?: string[];
  // 공통 옵션
  disablePastDates?: boolean;
  // 선택된 날짜(원)와 기간 띠의 색 (기본값: 'black')
  color?: DateColor;
};

export type SingleDatePickerProps = DatePickerBaseProps & {
  // 생략하면 'single'
  mode?: 'single';
  // YYYY-MM-DD
  selectedDate?: string;
  handleDateChangeAction?: (nextDate: string) => void;
};

export type RangeDatePickerProps = DatePickerBaseProps & {
  mode: 'range';
  selectedRange?: DateRange;
  handleRangeChangeAction?: (nextRange: DateRange) => void;
};

export type MultipleDatePickerProps = DatePickerBaseProps & {
  mode: 'multiple';
  // 고른 날짜들 (YYYY-MM-DD). 누를 때마다 넣고 뺀다
  selectedDates?: string[];
  handleDatesChangeAction?: (nextDates: string[]) => void;
};

export type DatePickerProps =
  SingleDatePickerProps | RangeDatePickerProps | MultipleDatePickerProps;
