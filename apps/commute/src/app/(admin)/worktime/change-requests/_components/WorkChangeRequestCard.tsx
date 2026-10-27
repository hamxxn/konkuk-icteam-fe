import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { Button, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkTimeRange } from '@/shared/apis/common';
import type { WorkChangeRequest } from '../../../_apis/workChangeRequests';
import { formatMonthDay, formatMonthDayTime } from '@/shared/utils/formatDate';

type WorkChangeRequestCardProps = {
  request: WorkChangeRequest;
  onApprove: () => void;
  onReject: () => void;
};

const STATUS_CHIP = {
  CS01: { label: '승인 대기', tone: 'gray' },
  CS02: { label: '승인', tone: 'blue' },
  CS03: { label: '반려', tone: 'red' },
} as const;

const formatSchedule = ({ date, start, end }: WorkTimeRange) =>
  `${formatMonthDay(date)} ${start}-${end}`;

type ScheduleListProps = {
  label: string;
  className: string;
  schedules: WorkTimeRange[];
};

const ScheduleList = ({ label, className, schedules }: ScheduleListProps) =>
  schedules.length === 0 ? null : (
    <div className='flex flex-col gap-[0.4rem]'>
      <span className={cn('font-14-bd', className)}>{label}</span>
      {schedules.map((schedule) => (
        <span
          key={`${toISO(schedule.date)}-${schedule.start}`}
          className='caption-14-rg text-gray-700'
        >
          {formatSchedule(schedule)}
        </span>
      ))}
    </div>
  );

// 근무 변경 요청 한 건. 뺄 근무·더할 근무·사유를 보여 주고, 대기 중이면 승인·반려 버튼을 단다
export default function WorkChangeRequestCard({
  request,
  onApprove,
  onReject,
}: WorkChangeRequestCardProps) {
  const status = STATUS_CHIP[request.statusCode];

  return (
    <article className='bg-black-1 flex flex-col gap-[1.2rem] rounded-[1.2rem] border border-gray-50 p-[2rem]'>
      <div className='flex items-center justify-between gap-[0.8rem]'>
        <h3 className='font-18-bd text-black'>{request.userName}</h3>
        <div className='flex items-center gap-[0.8rem]'>
          <span className='caption-12-md text-gray-500'>
            {`${formatMonthDayTime(request.requestedAt)} 요청`}
          </span>
          <StateChip label={status.label} tone={status.tone} />
        </div>
      </div>

      <ScheduleList label='삭제' className='text-red' schedules={request.deleteSchedules} />
      <ScheduleList label='추가' className='text-blue' schedules={request.addSchedules} />

      <div className='flex flex-col gap-[0.4rem]'>
        <span className='font-14-bd text-gray-700'>사유</span>
        <p className='caption-14-rg text-gray-700'>{request.reason}</p>
      </div>

      {request.rejectReason ? (
        <div className='flex flex-col gap-[0.4rem] rounded-[0.8rem] bg-gray-50 px-[1.2rem] py-[1rem]'>
          <span className='caption-12-md text-red'>반려 사유</span>
          <p className='caption-14-rg text-gray-700'>{request.rejectReason}</p>
        </div>
      ) : null}

      {/* 카드 높이가 같아도 버튼은 늘 맨 아래에 붙는다 */}
      {request.statusCode === 'CS01' ? (
        <div className='mt-auto flex justify-end gap-[0.8rem] pt-[0.4rem]'>
          <Button display='inline' size='small' tone='subtle_2' color='black' onClick={onReject}>
            반려
          </Button>
          <Button display='inline' size='small' color='blue' onClick={onApprove}>
            승인
          </Button>
        </div>
      ) : null}
    </article>
  );
}
