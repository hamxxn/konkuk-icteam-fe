import { IconArrowLeft } from '@konkuk-icteam-fe/design-system/assets';
import { IconButton } from '@konkuk-icteam-fe/design-system/ui';

type BackHeaderProps = {
  title: string;
  year: number;
  month: number;
  onBack: () => void;
};

// 수정 요청·신청 화면 맨 위: 뒤로가기, 연월, 제목
export default function BackHeader({ title, year, month, onBack }: BackHeaderProps) {
  return (
    <header className='flex items-start gap-[0.8rem]'>
      <IconButton aria-label='이전 페이지' onClick={onBack}>
        <IconArrowLeft aria-hidden className='h-[2.4rem] w-[2.4rem] text-black' />
      </IconButton>
      <div>
        <h2 className='font-16-md text-blue'>{`${year}년 ${month}월`}</h2>
        <h1 className='title-20-bd text-black'>{title}</h1>
      </div>
    </header>
  );
}
