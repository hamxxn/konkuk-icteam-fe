'use client';

import { useState } from 'react';
import { getWorkApplicationSettings } from '@/app/(student)/_apis/workApplications';
import { getMyWorkRecord } from '@/app/(student)/_apis/workRecords';

const MINUTES_PER_HOUR = 60;

// 분을 소수 첫째 자리까지의 시간으로 바꾼다 (예: 150 → 2.5)
const toHours = (minutes: number) => Math.round((minutes / MINUTES_PER_HOUR) * 10) / 10;

// 이번주·이번달 근무 시간. 기준(최소·최대)은 관리자가 이번 달 근로신청 때 정한 값을 쓴다
export default function WorkSummarySection() {
  const [today] = useState(() => new Date());
  const record = getMyWorkRecord({ date: today });
  const { settings } = getWorkApplicationSettings({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  return (
    <section className='grid grid-cols-2 gap-[1.2rem]'>
      <WorkSummaryCard
        title='이번주 근무 시간'
        currentHours={toHours(record.weeklyWorkedMinutes)}
        minHours={settings?.weeklyMinHours ?? null}
        maxHours={settings?.weeklyMaxHours ?? null}
      />
      <WorkSummaryCard
        title='이번달 근무 시간'
        currentHours={toHours(record.monthlyWorkedMinutes)}
        minHours={settings?.monthlyMinHours ?? null}
        maxHours={settings?.monthlyMaxHours ?? null}
      />
    </section>
  );
}

type WorkSummaryCardProps = {
  title: string;
  currentHours: number;
  // 그 달 근로신청 기준. 기준이 없는 달이면 null
  minHours: number | null;
  maxHours: number | null;
};

const WorkSummaryCard = ({ title, currentHours, minHours, maxHours }: WorkSummaryCardProps) => {
  const progress =
    maxHours && maxHours > 0 ? Math.max(0, Math.min((currentHours / maxHours) * 100, 100)) : 0;

  return (
    <article className='flex min-w-0 flex-col gap-[0.8rem] rounded-[0.6rem] border border-gray-50 px-[1.2rem] py-[2rem]'>
      <h2 className='caption-11-md text-gray-400'>{title}</h2>
      <p className='flex items-end gap-[0.4rem]'>
        <strong className='title-20-bd text-black'>{currentHours}</strong>
        {maxHours !== null && (
          <span className='caption-12-md text-gray-400'>{`/ ${maxHours}h`}</span>
        )}
      </p>
      <div
        className='relative h-[0.6rem] w-full overflow-hidden rounded-full bg-gray-50'
        role='progressbar'
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={maxHours ?? undefined}
        aria-valuenow={currentHours}
      >
        <div
          className='bg-blue absolute inset-y-0 left-0 rounded-full'
          style={{ width: `${progress}%` }}
        />
      </div>
      {minHours !== null && <p className='caption-11-md text-gray-400'>{`최소 ${minHours}h`}</p>}
    </article>
  );
};
