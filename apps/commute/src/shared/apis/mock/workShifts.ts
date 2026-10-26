import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { getMonthDates } from '@/shared/lib/calendar';
import type { ApiJson } from '../common';
import type { TodoPeriod } from '../todos';
import type { WorkShift, WorkStatusCode } from '../workShifts';
import { DEMO_MORNING_SLOT_STARTS, getMyDaySlotsMock } from './workSchedules';

// 출근 체크한 시각 (첫 배치 id → YYYY-MM-DDTHH:mm:ss). 새로 고침하면 처음으로 돌아간다
const CHECKED_IN_AT: Record<number, string> = {};

/**
 * 오늘 데모 오전 근무를 08:55에 출근한 것으로 둡니다. 근무가 끝나기 전에는 근무중이라 업무 체크리스트를 펼쳐 볼 수 있습니다.
 * @param now 기준 시각
 * @example seedDemoCheckInMock(new Date());
 */
const seedDemoCheckInMock = (now: Date) => {
  const todayKey = toISO(now);
  const firstMorningSlot = getMyDaySlotsMock(todayKey).find(
    ({ start }) => start === DEMO_MORNING_SLOT_STARTS[0],
  );
  if (!firstMorningSlot) return;

  CHECKED_IN_AT[firstMorningSlot.scheduleId] = `${todayKey}T08:55:00`;
};

seedDemoCheckInMock(new Date());

const NOON = '12:00';

const getNowTime = (now: Date) => now.toTimeString().slice(0, 5);

/**
 * 근무 상태를 정합니다. 지난 근무는 출근했으면 완료·안 했으면 결근, 진행 중인 근무는 출근했으면 근무중입니다.
 * @param shift 근무 구간과 출근 시각
 * @param shift.dateKey 날짜 (YYYY-MM-DD)
 * @param shift.end 끝 시각 (HH:mm)
 * @param shift.checkedInAt 출근 시각 (없으면 null)
 * @param now 기준 시각
 * @returns 근무 상태 코드
 * @example getWorkStatusCode({ dateKey: '2026-10-20', end: '12:00', checkedInAt: null }, new Date()); // 'WK04'
 */
const getWorkStatusCode = (
  { dateKey, end, checkedInAt }: { dateKey: string; end: string; checkedInAt: string | null },
  now: Date,
): WorkStatusCode => {
  const todayKey = toISO(now);
  const isEnded = dateKey < todayKey || (dateKey === todayKey && end <= getNowTime(now));

  if (isEnded) return checkedInAt ? 'WK03' : 'WK04';

  return checkedInAt ? 'WK02' : 'WK01';
};

/**
 * 그날 내 근무 목업을 만듭니다. 관리자 시간표에서 내가 배치된 칸을 정오 기준으로 오전·오후로 나눠 묶습니다.
 * 지난 날 근무는 시작 시각에 출근한 것으로 둡니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @returns 근무 JSON (오전·오후 최대 1건씩)
 * @example getMyWorkShiftsMock('2026-10-27');
 */
export const getMyWorkShiftsMock = (dateKey: string): ApiJson<WorkShift>[] => {
  const now = new Date();
  const isPastDate = dateKey < toISO(now);
  const slots = getMyDaySlotsMock(dateKey);
  const periods: { period: TodoPeriod; slots: typeof slots }[] = [
    { period: 'MORNING', slots: slots.filter(({ start }) => start < NOON) },
    { period: 'AFTERNOON', slots: slots.filter(({ start }) => start >= NOON) },
  ];

  return periods.flatMap(({ period, slots: periodSlots }) => {
    const first = periodSlots[0];
    const last = periodSlots.at(-1);
    if (!first || !last) return [];

    const checkedInAt =
      CHECKED_IN_AT[first.scheduleId] ?? (isPastDate ? `${dateKey}T${first.start}:00` : null);

    return [
      {
        scheduleIds: periodSlots.map(({ scheduleId }) => scheduleId),
        period,
        start: first.start,
        end: last.end,
        workStatusCode: getWorkStatusCode({ dateKey, end: last.end, checkedInAt }, now),
        checkedInAt,
      },
    ];
  });
};

/**
 * 그 달 내 근무가 있는 날짜 목업을 얻습니다.
 * @param year 연도
 * @param month 월 (1~12)
 * @returns 근무가 있는 날짜 (YYYY-MM-DD)
 * @example getMyWorkDatesMock(2026, 10);
 */
export const getMyWorkDatesMock = (year: number, month: number) =>
  getMonthDates(new Date(year, month - 1, 1)).filter(
    (dateKey) => getMyDaySlotsMock(dateKey).length > 0,
  );

export const clockInMock = (scheduleIds: number[]) => {
  const [firstScheduleId] = scheduleIds;
  const now = new Date();
  const todayKey = toISO(now);
  if (firstScheduleId === undefined) throw new Error('출근할 근무가 없습니다.');

  CHECKED_IN_AT[firstScheduleId] = `${todayKey}T${now.toTimeString().slice(0, 8)}`;

  const shift = getMyWorkShiftsMock(todayKey).find((item) =>
    item.scheduleIds.includes(firstScheduleId),
  );
  if (!shift) throw new Error('오늘 근무에서 출근할 근무를 찾을 수 없습니다.');

  return shift;
};
