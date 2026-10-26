'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import TimeTable from '@/shared/components/timetable/base/Week';
import { useTimeTable } from '@/shared/components/timetable/hooks/useTimeTable';
import { useTimeTableWeek } from '@/shared/components/timetable/hooks/useTimeTableWeek';
import WeekNavigator from './_components/WeekNavigator';
import WorkRuleNotice from './_components/WorkRuleNotice';
import { BottomCTAButton, Toggle } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';

// 근로 시간표 화면. 이번 달 안에서 주차를 오가며 내 근무 시간을 본다.
export default function PageClient() {
  const [today] = useState(() => new Date());
  const tableWeek = useTimeTableWeek(today);
  // '자세히'를 켜면 칸마다 신청 인원을 보여 주고, 마우스를 올리면 근무자 명단이 뜬다
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const { days, cells } = useTimeTable(isDetailVisible ? 'detail' : 'read', tableWeek.dates);
  const router = useRouter();

  const handleEditClick = () => {
    router.push(ROUTES.TIMETABLE_EDIT);
  };

  return (
    <div className='flex w-full flex-col gap-[2rem] px-[2rem] py-[2.4rem]'>
      <div>
        <h2 className='font-16-md text-blue'>{`${tableWeek.year}년 ${tableWeek.month}월`}</h2>
        <h1 className='title-20-bd text-black'>근로 시간표</h1>
      </div>

      <div className='grid grid-cols-[1fr_auto_1fr] items-center'>
        <div />
        <WeekNavigator
          week={tableWeek.week}
          isPrevWeekDisabled={tableWeek.isPrevWeekDisabled}
          isNextWeekDisabled={tableWeek.isNextWeekDisabled}
          onPrevWeek={tableWeek.handlePrevWeek}
          onNextWeek={tableWeek.handleNextWeek}
        />
        <Toggle
          className='justify-self-end'
          aria-label='자세히'
          checked={isDetailVisible}
          onCheckedChange={setIsDetailVisible}
        />
      </div>
      <TimeTable days={days} cells={cells} />
      <WorkRuleNotice />
      <BottomCTAButton>
        <BottomCTAButton.Single color='black' onClick={handleEditClick}>
          수정 요청
        </BottomCTAButton.Single>
      </BottomCTAButton>
    </div>
  );
}
