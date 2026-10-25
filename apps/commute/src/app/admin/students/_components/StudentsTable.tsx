import { IconArrowRight } from '@konkuk-icteam-fe/design-system/assets';
import { StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { formatYearMonth } from '../../_lib/monthKey';
import { EMPTY_STUDENT_TEXT } from '../_constants/student';
import { formatGrade, formatMinutesToHours } from '../_lib/studentFormat';
import type { StudentRow } from '../_hooks/useStudents';

type StudentsTableProps = {
  students: StudentRow[];
  // 현재 페이지의 첫 줄 앞까지 센 인원 수. 여기에 이어서 순번을 매긴다
  startNumber: number;
  // 이번 달 근무 기록 열(누적 근로시간·지각·수정요청)을 보여 줄지
  showsMonthlyRecord: boolean;
  // 이번 달 근로 여부 열을 보여 줄지 (전체 탭)
  showsCurrentMonthStatus: boolean;
  onDetailOpen: (userId: number) => void;
};

type Column = {
  label: string;
  className: string;
  render: (student: StudentRow, index: number) => React.ReactNode;
};

const COMMON_COLUMNS: Column[] = [
  { label: '성명', className: 'w-[8rem]', render: ({ name }) => name },
  {
    label: '학번',
    className: 'w-[10.4rem]',
    render: ({ studentId }) => studentId ?? EMPTY_STUDENT_TEXT,
  },
  {
    label: '학과',
    className: 'w-[15rem]',
    render: ({ department }) => department ?? EMPTY_STUDENT_TEXT,
  },
  { label: '학년', className: 'w-[6rem]', render: ({ grade }) => formatGrade(grade) },
  {
    label: '연락처',
    className: 'w-[12.4rem]',
    render: ({ phoneNumber }) => phoneNumber ?? EMPTY_STUDENT_TEXT,
  },
  {
    label: '근로 시작',
    className: 'w-[8.4rem]',
    render: ({ workStartDate }) => formatYearMonth(workStartDate),
  },
];

const MONTHLY_RECORD_COLUMNS: Column[] = [
  {
    label: '이번달 누적 근로시간',
    className: 'w-[14rem]',
    render: ({ monthlyRecord }) =>
      monthlyRecord
        ? `${formatMinutesToHours(monthlyRecord.monthlyWorkedMinutes)}시간 / ${formatMinutesToHours(monthlyRecord.monthlyLimitMinutes)}시간`
        : EMPTY_STUDENT_TEXT,
  },
  {
    label: '지각 횟수 (시간)',
    className: 'w-[11rem]',
    render: ({ monthlyRecord }) =>
      monthlyRecord
        ? `${monthlyRecord.lateCount}회 (${monthlyRecord.lateMinutes}분)`
        : EMPTY_STUDENT_TEXT,
  },
  {
    label: '수정요청',
    className: 'w-[11rem]',
    render: ({ monthlyRecord }) =>
      monthlyRecord
        ? `총 ${monthlyRecord.totalChangeRequestCount}건 (승인 ${monthlyRecord.approvedChangeRequestCount}건)`
        : EMPTY_STUDENT_TEXT,
  },
];

const CURRENT_MONTH_STATUS_COLUMN: Column = {
  label: '이번 달',
  className: 'w-[9rem]',
  render: ({ isCurrentMonthWorker }) =>
    isCurrentMonthWorker ? (
      <StateChip label='근로 중' tone='blue' />
    ) : (
      <StateChip label='쉬는 중' tone='gray' />
    ),
};

const CELL_CLASS_NAME = 'h-[4.8rem] px-[1.2rem] whitespace-nowrap';

// 근로장학생 목록 표. 달마다 근로학생이 달라서, 이번 달 근로학생에게만 근무 기록 열이 붙는다
export default function StudentsTable({
  students,
  startNumber,
  showsMonthlyRecord,
  showsCurrentMonthStatus,
  onDetailOpen,
}: StudentsTableProps) {
  const columns = [
    ...COMMON_COLUMNS,
    ...(showsMonthlyRecord ? MONTHLY_RECORD_COLUMNS : []),
    ...(showsCurrentMonthStatus ? [CURRENT_MONTH_STATUS_COLUMN] : []),
  ];
  const columnCount = columns.length + 2;

  return (
    <div className='w-full overflow-x-auto'>
      <table className='caption-12-rg w-full table-fixed border-collapse text-left'>
        <thead>
          <tr className='border-b-2 border-gray-50'>
            <th scope='col' className='caption-12-md h-[4rem] w-[5rem] px-[1.2rem] text-center'>
              번호
            </th>
            {columns.map(({ label, className }) => (
              <th
                key={label}
                scope='col'
                className={`caption-12-md h-[4rem] px-[1.2rem] ${className}`}
              >
                {label}
              </th>
            ))}
            <th scope='col' className='caption-12-md h-[4rem] w-[7.2rem] px-[1.2rem]'>
              상세보기
            </th>
          </tr>
        </thead>
        <tbody className='caption-14-rg divide-y divide-gray-50 border-b border-gray-50 text-gray-700'>
          {students.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                className='font-16-rg py-[3.2rem] text-center text-gray-500'
              >
                조회된 근로장학생이 없습니다.
              </td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={student.userId} className='transition-colors hover:bg-gray-50'>
                <td className={`${CELL_CLASS_NAME} text-center`}>{startNumber + index + 1}</td>
                {columns.map(({ label, render }) => (
                  <td key={label} className={`${CELL_CLASS_NAME} truncate`}>
                    {render(student, index)}
                  </td>
                ))}
                <td className={CELL_CLASS_NAME}>
                  <button
                    type='button'
                    aria-label={`${student.name} 상세보기`}
                    className='flex h-[2.8rem] w-[2.8rem] cursor-pointer items-center justify-center rounded-[0.8rem] border border-gray-50 text-gray-700 hover:bg-gray-50'
                    onClick={() => onDetailOpen(student.userId)}
                  >
                    <IconArrowRight aria-hidden className='h-[2rem] w-[2rem]' />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
