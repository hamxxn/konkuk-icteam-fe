import type { Meta, StoryObj } from '@storybook/react-vite';
import Textarea from '../../input/textarea/Textarea';
import ConfirmModal from './ConfirmModal';

const meta: Meta<typeof ConfirmModal> = {
  title: 'modal/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
  args: {
    open: true,
    showCloseButton: false,
    title: '제목',
    description: '설명',
    buttons: [
      {
        label: '왼쪽 버튼',
        size: 'medium',
        tone: 'subtle_2',
        color: 'gray',
        onClick: () => alert('버튼 클릭'),
      },
      { label: '오른쪽 버튼', size: 'medium', color: 'black', onClick: () => alert('버튼 클릭') },
    ],
  },
  parameters: {
    docs: {
      description: {
        component: '사용자의 의사를 확인하는 ConfirmModal 컴포넌트입니다.',
      },
      // 모달은 fixed 오버레이라서 Docs 페이지에 여러 스토리가 한 문서에 동시에 열려 있으면
      // 서로 겹쳐 보인다. 스토리마다 자기 iframe에서 따로 렌더링되도록 분리한다
      story: { inline: false, iframeHeight: 420 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {};

// 제목과 버튼 사이에 요약 표나 입력칸 같은 내용을 넣을 수 있다
export const WithContent: Story = {
  args: {
    title: '반려하시겠습니까?',
    description: '반려 사유는 근로학생에게 그대로 보입니다.',
    layoutClassName: 'w-[40rem]',
    children: <Textarea aria-label='반려 사유' placeholder='반려 사유를 입력해 주세요.' rows={4} />,
  },
};
