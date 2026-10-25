import { StateChip } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkScheduleSlot } from '../../_apis/workSchedules';
import { PERIODS } from '../../_constants/period';
import { getWorkerChipTone } from '../../_lib/getWorkerChipTone';

type WorkScheduleListProps = {
  slots: WorkScheduleSlot[];
};

type ScheduleRowProps = {
  slot: WorkScheduleSlot;
};

// 한 시간 칸 한 줄. 시각, 근무하는 사람, 인원 수를 보여 준다
const ScheduleRow = ({ slot }: ScheduleRowProps) => (
  <div className='grid grid-cols-[4rem_1fr_3.2rem] items-start gap-[1.2rem] border-b border-gray-50 px-[0.8rem] py-[0.8rem] last:border-b-0'>
    <time className='font-16-md text-black'>{slot.start}</time>
    <div className='flex min-w-0 flex-wrap gap-[0.6rem]'>
      {slot.users.map(({ userId, userName }) => (
        <StateChip key={userId} label={userName} tone={getWorkerChipTone(userId)} />
      ))}
    </div>
    <span className='caption-12-md pt-[0.2rem] text-right text-gray-400'>
      {`${slot.users.length}명`}
    </span>
  </div>
);

// 하루치 근무 시간표 목록. 한 시간 단위로 누가 근무하는지 오전·오후로 나눠 보여 준다. 아무도 없는 칸은 뺀다
export default function WorkScheduleList({ slots }: WorkScheduleListProps) {
  const groups = PERIODS.map(({ label, checkHour }) => ({
    label,
    slots: slots.filter(
      ({ start, users }) => users.length > 0 && checkHour(Number(start.split(':')[0])),
    ),
  })).filter((group) => group.slots.length > 0);

  return (
    <div className='bg-black-1 rounded-[1.2rem] border border-gray-50 p-[1.6rem] pr-[2.1rem]'>
      {groups.length > 0 ? (
        <div className='flex flex-col gap-[2.4rem]'>
          {groups.map((group) => (
            <div key={group.label}>
              <p className='font-14-bd mb-[0.8rem] px-[0.6rem] text-black'>{group.label}</p>
              {group.slots.map((slot) => (
                <ScheduleRow key={slot.start} slot={slot} />
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
