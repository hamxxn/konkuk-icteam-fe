import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect } from 'storybook/test';
import ComboBox from './ComboBox';

const meta: Meta<typeof ComboBox> = {
  title: 'input/ComboBox',
  component: ComboBox,
  tags: ['autodocs'],
  args: {
    options: ['옵션 1', '옵션 2', '옵션 3'],
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '검색 가능한 콤보박스 컴포넌트입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='w-[45rem]'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {};

export const ManyOptions: Story = {
  args: {
    options: [
      '서울',
      '부산',
      '대구',
      '인천',
      '광주',
      '대전',
      '울산',
      '세종',
      '경기',
      '강원',
      '충북',
      '충남',
      '전북',
      '전남',
      '경북',
      '경남',
      '제주',
    ],
  },
};

export const NoOptions: Story = {
  args: {
    options: [],
  },
};

// 입력한 글자로 후보를 만드는 자동완성. 후보가 없을 때는 목록을 띄우지 않고, 입력칸은 테두리를 둔다
function AutocompleteTemplate() {
  const [value, setValue] = useState('');
  const options = value && !value.includes('@') ? [`${value}@konkuk.ac.kr`] : [];

  return (
    <ComboBox
      options={options}
      value={value}
      onChange={setValue}
      placeholder='아이디@konkuk.ac.kr'
      showEmptyMessage={false}
      inputProps={{ hasBorder: true, type: 'email', 'aria-label': '학교 메일' }}
    />
  );
}

export const Autocomplete: Story = {
  render: () => <AutocompleteTemplate />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: '학교 메일' });
    await userEvent.type(input, 'gildong');
    await userEvent.click(await canvas.findByText('gildong@konkuk.ac.kr'));

    await expect(input).toHaveValue('gildong@konkuk.ac.kr');
    await expect(canvas.queryByText('결과가 없습니다.')).toBeNull();
  },
};
