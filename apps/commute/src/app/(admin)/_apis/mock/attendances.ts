import { formatNumber, parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';
import type { ApiJson } from '@/app/(student)/_apis/common';
import { removeDuplicatesBy } from '@/shared/utils/array';
import { convertMinutesToTime, convertTimeToMinutes } from '@/shared/utils/time';
import { mergeContinuousSlots } from '@/shared/utils/timeRange';
import type { AttendanceShift } from '../attendances';
import { getDaySlotsMock } from './workSchedules';

// 출근 기록 목업. 날짜·사람·근무 시작 시각만으로 정해져서 화면마다 어긋나지 않는다

// 10번 중 결근 1번, 지각 2번 꼴로 둔다
const ABSENT_SEED_COUNT = 1;
const LATE_SEED_COUNT = 2;

const createSeed = (...values: number[]) =>
  values.reduce((seed, value) => (seed * 31 + value) % 9973, 11);

/**
 * 그날 사람마다 이어진 근무 구간을 만듭니다. 칸의 끝과 다음 칸의 시작이 같으면 한 구간으로 묶습니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @returns 근무 구간 목록 (시작 시각 순)
 * @example getDayShifts('2026-10-27')[0]; // { userId: 4, userName: '박지우', start: '09:00', end: '11:00' }
 */
const getDayShifts = (dateKey: string) => {
  const slots = getDaySlotsMock(dateKey);
  const users = removeDuplicatesBy(
    slots.flatMap((slot) => slot.users),
    ({ userId }) => userId,
  );

  return users
    .flatMap(({ userId, userName }) =>
      mergeContinuousSlots(
        slots.filter((slot) => slot.users.some((user) => user.userId === userId)),
      ).map(({ start, end }) => ({ userId, userName, start, end })),
    )
    .sort((first, second) => first.start.localeCompare(second.start));
};

/**
 * 근무 구간 하나의 출근 시각을 정합니다. 결근이면 null, 지각이면 시작 5~24분 뒤, 나머지는 시작 1~8분 전입니다.
 * 아직 오지 않은 시각이면 출근 전이라 null입니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param shift 근무 구간
 * @param shift.userId 근로학생 id
 * @param shift.start 시작 시각 (HH:mm)
 * @param now 기준 시각
 * @returns 출근 시각 (YYYY-MM-DDTHH:mm:ss) 또는 null
 * @example createCheckedInAt('2026-10-20', { userId: 1, start: '09:00' }, new Date()); // '2026-10-20T08:57:00'
 */
const createCheckedInAt = (
  dateKey: string,
  { userId, start }: { userId: number; start: string },
  now: Date,
) => {
  const date = parseISO(dateKey);
  const startMinutes = convertTimeToMinutes(start);
  const seed = createSeed(
    userId,
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startMinutes,
  );
  // 0~9 중 결근·지각·제때 출근을 가르는 값
  const attendanceRoll = seed % 10;
  if (attendanceRoll < ABSENT_SEED_COUNT) return null;

  const checkedInMinutes =
    attendanceRoll < ABSENT_SEED_COUNT + LATE_SEED_COUNT
      ? startMinutes + 5 + (seed % 20)
      : startMinutes - 1 - (seed % 8);
  const checkedInAt = `${dateKey}T${convertMinutesToTime(checkedInMinutes)}:00`;
  const nowAt = `${toISO(now)}T${formatNumber(now.getHours())}:${formatNumber(now.getMinutes())}:00`;

  return checkedInAt <= nowAt ? checkedInAt : null;
};

/**
 * 그날 근무 구간마다 출근 기록 목업을 얻습니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @returns 출근 기록 JSON
 * @example getDayAttendanceShiftsMock('2026-10-27');
 */
export const getDayAttendanceShiftsMock = (dateKey: string): ApiJson<AttendanceShift>[] => {
  const now = new Date();

  return getDayShifts(dateKey).map((shift) => ({
    ...shift,
    checkedInAt: createCheckedInAt(dateKey, shift, now),
  }));
};
