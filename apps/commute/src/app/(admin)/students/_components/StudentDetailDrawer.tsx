'use client';

import { useEffect, useState } from 'react';
import { IconClose } from '@konkuk-icteam-fe/design-system/assets';
import { Button, IconButton, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import type { Worker } from '../../_apis/workers';
import { formatYearMonth } from '@/shared/utils/formatDate';
import { EMPTY_STUDENT_TEXT } from '../_constants/student';
import { formatGrade, formatMinutesToHours } from '../_utils/studentFormat';
import type { StudentRow } from '../_hooks/useStudents';
import StudentEditForm from './StudentEditForm';

type StudentDetailDrawerProps = {
  // 열린 학생. 없으면 닫혀 있다
  student: StudentRow | null;
  onClose: () => void;
  onUpdate: (profile: Worker) => void;
};

type InfoItemProps = {
  label: string;
  value: string;
};

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className='flex flex-1 flex-col gap-[0.4rem]'>
    <dt className='caption-14-md text-gray-400'>{label}</dt>
    <dd className='font-16-bd text-black'>{value}</dd>
  </div>
);

// 근로장학생 상세 정보. 화면 오른쪽에서 열리고, 정보 수정을 누르면 같은 자리에서 수정 화면으로 바뀐다.
// 이번 달 근로학생이면 이번 달 근무 기록도 보여 준다
export default function StudentDetailDrawer({
  student,
  onClose,
  onUpdate,
}: StudentDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  useEffect(() => {
    if (!student) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsEditing(false);
      onClose();
    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [student, onClose]);

  if (!student) return null;

  const handleSubmit = (profile: Worker) => {
    onUpdate(profile);
    setIsEditing(false);
  };

  const record = student.monthlyRecord;

  return (
    <div className='fixed inset-0 z-50 flex justify-end'>
      {/* 바깥 어두운 곳을 누르면 닫힌다 */}
      <button
        type='button'
        aria-label='상세보기 닫기'
        className='absolute inset-0 cursor-default bg-gray-900/30'
        onClick={handleClose}
      />
      <section
        role='dialog'
        aria-modal='true'
        aria-label='근로장학생 상세보기'
        className='bg-black-1 relative flex h-full w-[48rem] flex-col gap-[4rem] overflow-y-auto px-[3.2rem] py-[4rem]'
      >
        <div className='flex items-center justify-between'>
          <h2 className='title-23-eb text-black'>근로장학생 상세보기</h2>
          <IconButton aria-label='닫기' onClick={handleClose}>
            <IconClose aria-hidden className='h-[2.4rem] w-[2.4rem] text-gray-700' />
          </IconButton>
        </div>

        <div className='flex items-end justify-between'>
          <div>
            <div className='flex items-center gap-[0.8rem]'>
              <p className='title-23-eb text-black'>{student.name}</p>
              {student.isCurrentMonthWorker ? (
                <StateChip label='이번 달 근로 중' tone='blue' />
              ) : (
                <StateChip label='이번 달 쉬는 중' tone='gray' />
              )}
            </div>
            <p className='font-16-rg text-gray-500'>
              {isEditing
                ? '정보 수정'
                : `${student.studentId ?? EMPTY_STUDENT_TEXT} · ${student.department ?? EMPTY_STUDENT_TEXT} · ${formatGrade(student.grade)}`}
            </p>
          </div>
          {isEditing ? null : (
            <Button
              display='inline'
              size='small'
              tone='subtle_2'
              color='black'
              onClick={() => setIsEditing(true)}
            >
              정보 수정
            </Button>
          )}
        </div>

        {isEditing ? (
          <StudentEditForm
            profile={student}
            onCancel={() => setIsEditing(false)}
            onSubmit={handleSubmit}
          />
        ) : (
          <>
            <dl className='flex gap-[2.8rem] rounded-[1.2rem] border border-gray-50 px-[1.8rem] py-[1.6rem]'>
              <InfoItem label='연락처' value={student.phoneNumber ?? EMPTY_STUDENT_TEXT} />
              <InfoItem label='근로 시작' value={formatYearMonth(student.workStartDate)} />
            </dl>

            {record ? (
              <section className='flex flex-col gap-[1.2rem]'>
                <h3 className='font-16-bd text-black'>이번 달 근무 기록</h3>
                <dl className='grid grid-cols-3 gap-[1.2rem]'>
                  <div className='flex flex-col gap-[0.4rem] rounded-[1.2rem] bg-gray-50 px-[1.6rem] py-[1.4rem]'>
                    <dt className='caption-12-md text-gray-500'>누적 근로시간</dt>
                    <dd className='font-18-bd text-black'>{`${formatMinutesToHours(record.monthlyWorkedMinutes)}시간`}</dd>
                    <dd className='caption-12-rg text-gray-400'>{`/ 최대 ${formatMinutesToHours(record.monthlyLimitMinutes)}시간`}</dd>
                  </div>
                  <div className='flex flex-col gap-[0.4rem] rounded-[1.2rem] bg-gray-50 px-[1.6rem] py-[1.4rem]'>
                    <dt className='caption-12-md text-gray-500'>지각</dt>
                    <dd className='font-18-bd text-black'>{`${record.lateCount}회`}</dd>
                    <dd className='caption-12-rg text-gray-400'>{`총 ${record.lateMinutes}분`}</dd>
                  </div>
                  <div className='flex flex-col gap-[0.4rem] rounded-[1.2rem] bg-gray-50 px-[1.6rem] py-[1.4rem]'>
                    <dt className='caption-12-md text-gray-500'>수정요청</dt>
                    <dd className='font-18-bd text-black'>{`${record.totalChangeRequestCount}회`}</dd>
                    <dd className='caption-12-rg text-gray-400'>{`승인 ${record.approvedChangeRequestCount}회`}</dd>
                  </div>
                </dl>
              </section>
            ) : null}

            <section className='flex flex-col gap-[1.2rem]'>
              <h3 className='font-16-bd text-black'>계정</h3>
              <div className='flex items-baseline gap-[0.8rem] rounded-[1.2rem] border border-gray-50 px-[1.8rem] py-[1.6rem]'>
                <span className='caption-12-rg text-gray-500'>ID</span>
                <span className='font-16-md text-gray-700'>
                  {student.email ?? EMPTY_STUDENT_TEXT}
                </span>
              </div>
            </section>
          </>
        )}
      </section>
    </div>
  );
}
