'use client';

import { useState } from 'react';
import { Button, ConfirmModal, Dropdown, Input } from '@konkuk-icteam-fe/design-system/ui';
import type { Worker } from '../../_apis/workers';
import { GRADE_OPTIONS, NO_GRADE_LABEL } from '../_constants/student';
import { formatGrade, parseGradeLabel } from '../_lib/studentFormat';

type StudentEditFormProps = {
  profile: Worker;
  onCancel: () => void;
  onSubmit: (profile: Worker) => void;
};

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

const Field = ({ label, children }: FieldProps) => (
  // label로 감싸서 글자를 눌러도 입력칸에 커서가 간다
  <label className='flex min-w-0 flex-1 flex-col gap-[0.8rem]'>
    <span className='caption-12-md text-gray-500'>{label}</span>
    {children}
  </label>
);

// 근로장학생 정보 수정. 아무것도 바꾸지 않으면 저장할 수 없고, 저장 전에 한 번 더 묻는다
export default function StudentEditForm({ profile, onCancel, onSubmit }: StudentEditFormProps) {
  // 아직 채우지 않은 정보는 null로 온다. 입력칸에는 빈 글자로 넣어야 제어 컴포넌트로 남는다
  const [name, setName] = useState(profile.name);
  const [studentId, setStudentId] = useState(profile.studentId ?? '');
  const [gradeLabel, setGradeLabel] = useState(
    profile.grade === null ? NO_GRADE_LABEL : formatGrade(profile.grade),
  );
  const [department, setDepartment] = useState(profile.department ?? '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? '');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const nextProfile: Worker = {
    ...profile,
    name: name.trim(),
    studentId: studentId.trim() || null,
    grade: parseGradeLabel(gradeLabel),
    department: department.trim() || null,
    phoneNumber: phoneNumber.trim() || null,
  };
  const hasChanges = (['name', 'studentId', 'grade', 'department', 'phoneNumber'] as const).some(
    (key) => nextProfile[key] !== profile[key],
  );

  return (
    <div className='flex flex-col gap-[1.8rem]'>
      <Field label='이름'>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
      <div className='flex gap-[1.2rem]'>
        <Field label='학번'>
          <Input value={studentId} onChange={(event) => setStudentId(event.target.value)} />
        </Field>
        <div className='flex min-w-0 flex-1 flex-col gap-[0.8rem]'>
          <span className='caption-12-md text-gray-500'>학년</span>
          <Dropdown options={GRADE_OPTIONS} value={gradeLabel} onChange={setGradeLabel} />
        </div>
      </div>
      <Field label='학과'>
        <Input value={department} onChange={(event) => setDepartment(event.target.value)} />
      </Field>
      <Field label='연락처'>
        <Input
          type='tel'
          value={phoneNumber}
          placeholder='010-0000-0000'
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </Field>

      <div className='mt-[1.2rem] flex justify-end gap-[0.8rem]'>
        <Button
          display='inline'
          size='medium'
          tone='subtle_2'
          color='gray'
          className='w-[11.2rem]'
          onClick={onCancel}
        >
          취소
        </Button>
        <Button
          display='inline'
          size='medium'
          color='blue'
          className='w-[11.2rem]'
          disabled={!hasChanges || nextProfile.name.length === 0}
          onClick={() => setIsConfirmOpen(true)}
        >
          저장
        </Button>
      </div>

      <ConfirmModal
        open={isConfirmOpen}
        handleOpenChange={setIsConfirmOpen}
        title='정보를 수정하시겠습니까?'
        description='수정된 정보는 시스템 전체에 적용됩니다.'
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          {
            label: '수정하기',
            color: 'blue',
            size: 'medium',
            onClick: () => onSubmit(nextProfile),
          },
        ]}
      />
    </div>
  );
}
