import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { useState } from 'react';
import { DATE_COLOR } from '../cell/constants/color';
import DatePicker, {
  MultipleDatePickerProps,
  RangeDatePickerProps,
  SingleDatePickerProps,
} from './DatePicker';
import { DateRange } from './types/dateRange';
import { toISO } from '@konkuk-icteam-fe/design-system/date';

const meta: Meta<typeof DatePicker> = {
  title: 'date/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: Object.keys(DATE_COLOR),
      description: '선택된 날짜(원)와 기간 띠의 색 (기본값 black)',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "하루 선택(기본)과 기간 선택(mode='range')을 지원하는 달력입니다. 기간 선택은 첫 클릭이 시작일, 다음 클릭이 종료일이며, 시작일보다 이전을 누르거나 사이에 disabledDates가 있으면 그 날짜부터 다시 시작합니다.",
      },
    },
  },
};

export default meta;

function SingleTemplate(args: SingleDatePickerProps) {
  const [viewMonth, setViewMonth] = useState<Date>(() => args.viewDateMonth ?? new Date());
  const [value, setValue] = useState<string | undefined>(
    () => args.selectedDate ?? (args.viewDateMonth ? toISO(args.viewDateMonth) : undefined),
  );

  return (
    <div className='bg-black-1 p-[1.6rem]'>
      <DatePicker
        {...args}
        selectedDate={value}
        viewDateMonth={viewMonth}
        handleMonthChangeAction={setViewMonth}
        handleDateChangeAction={(next) => {
          setValue(next);
          args.handleDateChangeAction?.(next);
        }}
      />
      <div className='caption-12-md mt-[1.2rem] text-gray-500'>selected: {value}</div>
    </div>
  );
}

function RangeTemplate(args: RangeDatePickerProps) {
  const [viewMonth, setViewMonth] = useState<Date>(() => args.viewDateMonth ?? new Date());
  const [range, setRange] = useState<DateRange | undefined>(args.selectedRange);

  return (
    <div className='bg-black-1 p-[1.6rem]'>
      <DatePicker
        {...args}
        mode='range'
        selectedRange={range}
        viewDateMonth={viewMonth}
        handleMonthChangeAction={setViewMonth}
        handleRangeChangeAction={(next) => {
          setRange(next);
          args.handleRangeChangeAction?.(next);
        }}
      />
      <div className='caption-12-md mt-[1.2rem] text-gray-500'>
        start: {range?.start ?? '-'} / end: {range?.end ?? '-'}
      </div>
    </div>
  );
}

type Story = StoryObj<SingleDatePickerProps>;
type RangeStory = StoryObj<RangeDatePickerProps>;

// 오늘로부터 n일 뒤 날짜 (YYYY-MM-DD)
const getDateAfter = (days: number) => {
  const today = new Date();
  return toISO(new Date(today.getFullYear(), today.getMonth(), today.getDate() + days));
};

export const Default: Story = {
  render: (args) => (
    <SingleTemplate {...args} disabledDates={[getDateAfter(1), getDateAfter(3), getDateAfter(7)]} />
  ),
};

export const DisablePastDates: Story = {
  render: (args) => <SingleTemplate {...args} />,
  args: {
    // 오늘 기준 과거 비활성화 동작 확인용
    disablePastDates: true,
  },
};

export const MinMaxRange: Story = {
  render: (args) => <SingleTemplate {...args} />,
  args: {
    viewDateMonth: new Date('2025-12-18'),
    disablePastDates: false,
    minDate: '2025-12-10',
    maxDate: '2025-12-25',
  },
};

export const Range: RangeStory = {
  render: (args) => <RangeTemplate {...args} />,
  args: {
    mode: 'range',
    selectedRange: { start: getDateAfter(2), end: getDateAfter(6) },
  },
};

export const RangeWithDisabledDates: RangeStory = {
  parameters: {
    docs: {
      description: {
        story:
          '기간 사이에 선택 불가 날짜(오늘+4일)가 있으면 기간이 이어지지 않고 그 날짜부터 다시 시작합니다.',
      },
    },
  },
  render: (args) => <RangeTemplate {...args} />,
  args: {
    mode: 'range',
    disabledDates: [getDateAfter(4)],
    selectedRange: { start: getDateAfter(2) },
  },
};

export const RangeMinMax: RangeStory = {
  render: (args) => <RangeTemplate {...args} />,
  args: {
    mode: 'range',
    viewDateMonth: new Date('2025-12-18'),
    disablePastDates: false,
    minDate: '2025-12-10',
    maxDate: '2025-12-25',
    selectedRange: { start: '2025-12-12', end: '2025-12-16' },
  },
};

export const ColorBlue: Story = {
  render: (args) => <SingleTemplate {...args} />,
  args: {
    color: 'blue',
    selectedDate: getDateAfter(2),
  },
};

export const RangeColorGreen: RangeStory = {
  render: (args) => <RangeTemplate {...args} />,
  args: {
    mode: 'range',
    color: 'green',
    selectedRange: { start: getDateAfter(2), end: getDateAfter(6) },
  },
};

export const SelectsRange: RangeStory = {
  tags: ['ai-generated'],
  render: (args) => <RangeTemplate {...args} />,
  args: {
    mode: 'range',
    viewDateMonth: new Date(2025, 11, 1),
    disablePastDates: false,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '2025-12-10' }));
    await userEvent.click(canvas.getByRole('button', { name: '2025-12-15' }));

    await expect(canvas.getByText('start: 2025-12-10 / end: 2025-12-15')).toBeVisible();
    // 기간 사이 날짜는 선택된 것으로 표시된다 (셀은 날짜 버튼의 부모 gridcell)
    const middleCell = canvas
      .getByRole('button', { name: '2025-12-12' })
      .closest('[role="gridcell"]');
    await expect(middleCell).toHaveAttribute('aria-selected', 'true');
  },
};

function MultipleTemplate(args: MultipleDatePickerProps) {
  const [dates, setDates] = useState<string[]>(args.selectedDates ?? []);

  return (
    <div className='bg-black-1 p-[1.6rem]'>
      <DatePicker
        {...args}
        selectedDates={dates}
        handleDatesChangeAction={(next: string[]) => {
          setDates(next);
          args.handleDatesChangeAction?.(next);
        }}
      />
      <div className='caption-12-md mt-[1.2rem] text-gray-500'>selected: {dates.join(', ')}</div>
    </div>
  );
}

type MultipleStory = StoryObj<MultipleDatePickerProps>;

export const SelectsMultipleDates: MultipleStory = {
  render: (args) => <MultipleTemplate {...args} />,
  args: {
    mode: 'multiple',
    color: 'red',
    defaultViewDateMonth: new Date(2025, 11, 1),
    disablePastDates: false,
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '2025-12-15' }));
    await userEvent.click(canvas.getByRole('button', { name: '2025-12-3' }));
    // 고른 날짜는 날짜순으로 넘어온다
    await expect(canvas.getByText('selected: 2025-12-03, 2025-12-15')).toBeVisible();

    // 이미 고른 날짜를 다시 누르면 빠진다
    await userEvent.click(canvas.getByRole('button', { name: '2025-12-15' }));
    await expect(canvas.getByText('selected: 2025-12-03')).toBeVisible();
  },
};
