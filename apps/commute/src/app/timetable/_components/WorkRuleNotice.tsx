import { IconInfo } from '@/shared/assets/icons';
import { MIN_WORK_HOURS_PER_SHIFT, WORK_HOUR_LIMITS } from '@/shared/config/workHours';

type WorkRuleNoticeProps = {
  // 화면마다 덧붙일 안내. 기본 근로 규칙 아래에 한 줄씩 보여 준다
  notices?: string[];
  children?: React.ReactNode;
};

// 표 아래 근로 규칙 안내
export default function WorkRuleNotice({ notices = [], children }: WorkRuleNoticeProps) {
  return (
    <div className='caption-12-md flex flex-col gap-[1rem] rounded-[1.2rem] border border-gray-300 px-[1.6rem] py-[1.2rem] text-gray-700'>
      <div className='flex items-center gap-[0.6rem]'>
        <IconInfo aria-hidden className='text-red h-[1.4rem] w-[1.4rem] shrink-0' />
        <p>
          {`1회 최소 ${MIN_WORK_HOURS_PER_SHIFT}시간 · 주 최대 ${WORK_HOUR_LIMITS.week}시간 · 월 목표 ${WORK_HOUR_LIMITS.month}시간`}
        </p>
      </div>
      {notices.length > 0 && (
        <ul className='flex flex-col gap-[0.4rem] pl-[2rem] text-gray-500'>
          {notices.map((notice) => (
            <li key={notice} className='list-disc'>
              {notice}
            </li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}
