import { IconInfo } from '@konkuk-icteam-fe/design-system/assets';
import type { WorkApplicationSettings } from '@/shared/apis/workApplications';
import { MIN_WORK_HOURS_PER_SHIFT } from '@/shared/config/workHours';

type WorkRuleNoticeProps = {
  // 그 달 근로신청 기준. 관리자가 아직 정하지 않은 달이면 null
  settings: WorkApplicationSettings | null;
  // 화면마다 덧붙일 안내. 기본 근로 규칙 아래에 한 줄씩 보여 준다
  notices?: string[];
  children?: React.ReactNode;
};

/**
 * 근로 규칙 한 줄을 만듭니다. 기준이 있으면 주·월 최소~최대 시간을 붙입니다.
 * @param settings 그 달 근로신청 기준 (없으면 null)
 * @returns 안내 문구
 * @example createRuleText(settings); // '1회 최소 1시간 · 주 6~15시간 · 월 30~60시간'
 */
const createRuleText = (settings: WorkApplicationSettings | null) => {
  const shiftRule = `1회 최소 ${MIN_WORK_HOURS_PER_SHIFT}시간`;
  if (!settings) return shiftRule;

  return `${shiftRule} · 주 ${settings.weeklyMinHours}~${settings.weeklyMaxHours}시간 · 월 ${settings.monthlyMinHours}~${settings.monthlyMaxHours}시간`;
};

// 표 아래 근로 규칙 안내
export default function WorkRuleNotice({ settings, notices = [], children }: WorkRuleNoticeProps) {
  return (
    <div className='caption-12-md flex flex-col gap-[1rem] rounded-[1.2rem] border border-gray-300 px-[1.6rem] py-[1.2rem] text-gray-700'>
      <div className='flex items-center gap-[0.6rem]'>
        <IconInfo aria-hidden className='text-red h-[1.4rem] w-[1.4rem] shrink-0' />
        <p>{createRuleText(settings)}</p>
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
