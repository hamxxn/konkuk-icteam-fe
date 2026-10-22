import { WORK_HOUR_LIMITS } from '../_constants';
import { USER_INFO_MOCK } from '../mock';

// 이번주·이번달 근무 시간
export default function WorkSummarySection() {
  return (
    <section className='grid grid-cols-2 gap-[1.2rem]'>
      <WorkSummaryCard
        currentHours={USER_INFO_MOCK.week}
        totalHours={WORK_HOUR_LIMITS.week}
        title='이번주 근무 시간'
      />
      <WorkSummaryCard
        currentHours={USER_INFO_MOCK.month}
        totalHours={WORK_HOUR_LIMITS.month}
        title='이번달 근무 시간'
      />
    </section>
  );
}

type WorkSummaryCardProps = {
  title: string;
  currentHours: number;
  totalHours: number;
};

const WorkSummaryCard = ({ title, currentHours, totalHours }: WorkSummaryCardProps) => {
  const progress =
    totalHours > 0 ? Math.max(0, Math.min((currentHours / totalHours) * 100, 100)) : 0;

  return (
    <article className='flex min-w-0 flex-col gap-[0.8rem] rounded-[0.6rem] border border-gray-50 px-[1.2rem] py-[2rem]'>
      <h2 className='caption-11-md text-gray-400'>{title}</h2>
      <p className='flex items-end gap-[0.4rem]'>
        <strong className='title-20-bd text-black'>{currentHours}</strong>
        <span className='caption-12-md text-gray-400'>{`/ ${totalHours}h`}</span>
      </p>
      <div
        className='relative h-[0.6rem] w-full overflow-hidden rounded-full bg-gray-50'
        role='progressbar'
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={totalHours}
        aria-valuenow={currentHours}
      >
        <div
          className='absolute inset-y-0 left-0 rounded-full bg-black'
          style={{ width: `${progress}%` }}
        />
      </div>
    </article>
  );
};
