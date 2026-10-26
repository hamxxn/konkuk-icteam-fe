'use client';

import Link from 'next/link';
import { SearchBar, Tabs } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import { useToast } from '@/shared/hooks/useToast';
import { ArrowButton } from '@/shared/ui';
import type { Worker } from '../_apis/workers';
import StudentDetailDrawer from './_components/StudentDetailDrawer';
import StudentsTable from './_components/StudentsTable';
import { useStudents } from './_hooks/useStudents';
import type { StudentTab } from './_utils/studentTab';

// 근로장학생. 달마다 근로학생이 달라서, 그 달 근로학생을 보거나 모든 근로장학생을 본다
type PageClientProps = {
  tab: StudentTab;
};

export default function PageClient({ tab }: PageClientProps) {
  const students = useStudents(tab);
  const { showToast, toast } = useToast();
  const [, month] = students.monthKey.split('-').map(Number);

  const tabs: { value: StudentTab; label: string }[] = [
    { value: 'MONTHLY', label: '월별 근로학생' },
    { value: 'ALL', label: '전체 근로장학생' },
  ];

  const handleProfileUpdate = (profile: Worker) => {
    students.handleProfileUpdate(profile);
    showToast('근로장학생 정보를 수정했어요.');
  };

  return (
    <div className='mx-auto w-full max-w-[140rem] p-[3.4rem]'>
      <section className='bg-black-1 flex flex-col gap-[2.4rem] rounded-[1.2rem] border border-gray-50 p-[3.2rem]'>
        <Tabs>
          <Tabs.List activeValue={tab} tabs={tabs} aria-label='보기'>
            {tabs.map(({ value, label }) => (
              <Tabs.Item
                key={value}
                as={Link}
                value={value}
                activeValue={tab}
                href={`${ROUTES.ADMIN_STUDENTS}?tab=${value}`}
                scroll={false}
                onClick={students.handleTabChange}
              >
                {label}
              </Tabs.Item>
            ))}
          </Tabs.List>
        </Tabs>

        <div className='flex items-center justify-between gap-[1.6rem]'>
          {students.tab === 'MONTHLY' ? (
            <div className='flex items-center gap-[1.6rem]'>
              <ArrowButton
                direction='left'
                size='medium'
                aria-label='이전 달'
                disabled={students.isPrevMonthDisabled}
                onClick={() => students.handleMonthMove(-1)}
              />
              <h1 className='title-23-eb min-w-[16rem] text-center text-black'>
                {`${month}월 근로학생 ${students.totalCount}명`}
              </h1>
              <ArrowButton
                direction='right'
                size='medium'
                aria-label='다음 달'
                disabled={students.isNextMonthDisabled}
                onClick={() => students.handleMonthMove(1)}
              />
            </div>
          ) : (
            <h1 className='title-23-eb text-black'>{`전체 근로장학생 ${students.totalCount}명`}</h1>
          )}

          <SearchBar
            aria-label='이름 검색'
            placeholder='이름을 검색하세요.'
            value={students.keyword}
            onChange={(event) => students.handleKeywordChange(event.target.value)}
            containerClassName='w-[28rem] rounded-[0.8rem]'
          />
        </div>

        {students.tab === 'MONTHLY' && students.totalCount === 0 && !students.keyword ? (
          <p className='font-16-rg rounded-[1.2rem] bg-gray-50 py-[4rem] text-center text-gray-500'>
            {`아직 ${month}월 근로학생이 정해지지 않았어요. 근로신청 관리에서 신청을 열 때 학생을 고를 수 있어요.`}
          </p>
        ) : (
          <StudentsTable
            students={students.students}
            startNumber={students.startNumber}
            showsMonthlyRecord={students.tab === 'MONTHLY' && students.isCurrentMonth}
            showsCurrentMonthStatus={students.tab === 'ALL'}
            onDetailOpen={students.handleDetailOpen}
          />
        )}

        <div className='flex items-center gap-[1.2rem] self-end'>
          <ArrowButton
            direction='left'
            size='medium'
            aria-label='이전 페이지'
            disabled={students.page === 0}
            onClick={() => students.handlePageChange(students.page - 1)}
          />
          <span className='font-16-rg text-black'>
            <strong className='font-bold'>{students.page + 1}</strong>
            {`/${students.totalPages}`}
          </span>
          <ArrowButton
            direction='right'
            size='medium'
            aria-label='다음 페이지'
            disabled={students.page >= students.totalPages - 1}
            onClick={() => students.handlePageChange(students.page + 1)}
          />
        </div>
      </section>

      <StudentDetailDrawer
        student={students.selectedStudent}
        onClose={students.handleDetailClose}
        onUpdate={handleProfileUpdate}
      />
      {toast}
    </div>
  );
}
