import { StateChip } from '@konkuk-icteam-fe/design-system/ui';
import type { AttendanceShift } from '../../../_apis/attendances';
import type { WorkScheduleSlot } from '../../../_apis/workSchedules';
import { PERIODS } from '../../../_constants/period';
import {
  SLOT_ATTENDANCE_STATUS_ORDER,
  SLOT_ATTENDANCE_STATUS_THEME,
} from '../../_constants/attendanceStatus';
import { findSlotShift, getSlotAttendanceStatus } from '../../_utils/attendanceStatus';
import { getWorkersByPeriod, type OnDutyWorker } from '../../_utils/getWorkersByPeriod';

type WorkScheduleListProps = {
  dateKey: string;
  slots: WorkScheduleSlot[];
  // 그날 근무 구간과 출근 기록. 칩 색(근태)을 정한다
  shifts: AttendanceShift[];
  now: Date;
};

type ScheduleRowProps = {
  dateKey: string;
  slot: WorkScheduleSlot;
  // 그 시간대 근무자. 이 순서대로 한 사람이 한 열을 차지한다
  workers: OnDutyWorker[];
  shifts: AttendanceShift[];
  now: Date;
};

// 30분 칸 한 줄. 시각, 사람마다 정해진 열에 근태 색 칩, 인원 수를 보여 준다. 그 칸에 없는 사람의 열은 비운다
const ScheduleRow = ({ dateKey, slot, workers, shifts, now }: ScheduleRowProps) => (
  <div className='grid grid-cols-[4rem_minmax(0,1fr)_3.2rem] items-center gap-[1.2rem] border-b border-gray-50 px-[0.8rem] py-[0.8rem] last:border-b-0'>
    <time className='font-16-md text-black'>{slot.start}</time>
    <div
      className='grid justify-items-start gap-[0.6rem]'
      style={{ gridTemplateColumns: `repeat(${workers.length}, max-content)` }}
    >
      {workers.map(({ userId, userName }) => {
        const isWorking = slot.users.some((user) => user.userId === userId);
        const shift = findSlotShift(shifts, userId, slot.start);
        // 열 너비를 이름 칩 너비로 맞추므로, 근무하지 않는 칸에도 보이지 않는 칩을 둬 열이 줄지 않게 한다
        if (!isWorking || !shift) {
          return (
            <span key={userId} aria-hidden className='invisible'>
              <StateChip label={userName} />
            </span>
          );
        }

        const { label, tone } =
          SLOT_ATTENDANCE_STATUS_THEME[getSlotAttendanceStatus(dateKey, slot, shift, now)];

        return (
          <StateChip key={userId} label={userName} tone={tone} title={`${userName} · ${label}`} />
        );
      })}
    </div>
    <span className='caption-12-md text-right text-gray-400'>{`${slot.users.length}명`}</span>
  </div>
);

// 근태 색 범례
const AttendanceLegend = () => (
  <ul aria-label='근태 색' className='flex flex-wrap justify-end gap-[0.6rem]'>
    {SLOT_ATTENDANCE_STATUS_ORDER.map((status) => (
      <li key={status}>
        <StateChip
          label={SLOT_ATTENDANCE_STATUS_THEME[status].label}
          tone={SLOT_ATTENDANCE_STATUS_THEME[status].tone}
        />
      </li>
    ))}
  </ul>
);

// 하루치 근무 시간표 목록. 30분 단위로 누가 근무하는지 오전·오후로 나눠 보여 주고, 아무도 없는 칸은 뺀다.
// 시간대 안에서 한 사람은 늘 같은 열에 놓여 겹치는 근무도 섞이지 않고, 칩 색으로 근무중·지각·결근 등을 알린다
export default function WorkScheduleList({ dateKey, slots, shifts, now }: WorkScheduleListProps) {
  const workersByPeriod = getWorkersByPeriod(slots);
  const groups = PERIODS.map(({ period, label, checkHour }) => ({
    label,
    workers: workersByPeriod[period],
    slots: slots.filter(
      ({ start, users }) => users.length > 0 && checkHour(Number(start.split(':')[0])),
    ),
  })).filter((group) => group.slots.length > 0);

  return (
    <div className='bg-black-1 rounded-[1.2rem] border border-gray-50 p-[1.6rem] pr-[2.1rem]'>
      {groups.length > 0 ? (
        <div className='flex flex-col gap-[2.4rem]'>
          <AttendanceLegend />
          {groups.map((group) => (
            <div key={group.label}>
              <p className='font-14-bd mb-[0.8rem] px-[0.6rem] text-black'>{group.label}</p>
              {group.slots.map((slot) => (
                <ScheduleRow
                  key={slot.start}
                  dateKey={dateKey}
                  slot={slot}
                  workers={group.workers}
                  shifts={shifts}
                  now={now}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className='caption-14-md py-[8rem] text-center text-gray-500'>
          이날은 근무 일정이 없습니다.
        </p>
      )}
    </div>
  );
}
