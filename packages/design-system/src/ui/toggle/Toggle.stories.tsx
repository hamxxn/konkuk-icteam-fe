import { useState } from 'react';
import { expect } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Toggle from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'toggle/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '켜고 끄는 스위치입니다. checked 상태는 사용하는 쪽에서 들고 있고, 누르면 onCheckedChange로 바뀐 값을 알려 줍니다. label이 없으면 aria-label로 이름을 붙여 주세요.',
      },
    },
  },
  argTypes: {
    checked: { control: 'boolean', description: '켜짐 여부' },
    label: { control: 'text', description: '스위치 왼쪽 글자 (없으면 스위치만 보임)' },
    disabled: { control: 'boolean', description: '비활성화 여부' },
    onCheckedChange: { action: 'checked changed', description: '바뀐 켜짐 여부를 알린다' },
  },
  args: {
    checked: false,
    label: '자세히보기',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { checked: true },
};

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': '자세히보기' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

const ToggleTemplate = (args: React.ComponentProps<typeof Toggle>) => {
  const [checked, setChecked] = useState(false);

  return <Toggle {...args} checked={checked} onCheckedChange={setChecked} />;
};

export const Interactive: Story = {
  tags: ['ai-generated'],
  render: (args) => <ToggleTemplate {...args} />,
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: '자세히보기' });
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  },
};
