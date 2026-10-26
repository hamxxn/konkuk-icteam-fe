import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { SLOT_TIMES } from '@/shared/config/slot';
import { checkWeekday, getMonthDates } from '@/shared/lib/calendar';
import { WorkStatus, type HomeTodaySchedule } from '../_types';
import { getScheduledWorkersMock, MY_USER_ID } from './workers';

const formatTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const NOON_MINUTES = 12 * 60;

const SHIFT_LABEL = {
  morning: '오전 근무',
  afternoon: '오후 근무',
} as const;

/**
 * 오늘 근무 일정 목업을 만듭니다. 근무는 오전·오후 근무 두 가지뿐이고, 언제 열어도 출근 흐름을
 * 확인할 수 있도록 지금 시각이 포함된 근무 1건과 나머지 시간대 근무 1건을 만듭니다.
 * @param now 기준 시각
 * @returns 오늘 근무 일정 목록
 * @example const schedules = createTodaySchedulesMock(new Date());
 */
const createTodaySchedulesMock = (now: Date): HomeTodaySchedule[] => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  // 30분 단위로 내림한 시각에 근무가 시작한 것으로 둔다
  const currentStart = Math.floor(currentMinutes / 30) * 30;
  const isMorningNow = currentStart < NOON_MINUTES;
  // 오전 근무는 정오를 넘기지 않는다
  const currentEnd = isMorningNow
    ? Math.min(currentStart + 120, NOON_MINUTES)
    : Math.min(currentStart + 120, 23 * 60 + 30);

  const currentShift: HomeTodaySchedule = {
    scheduleIds: isMorningNow ? [101] : [102],
    label: isMorningNow ? SHIFT_LABEL.morning : SHIFT_LABEL.afternoon,
    start: formatTime(currentStart),
    end: formatTime(currentEnd),
    workStatusCode: WorkStatus.SCHEDULED,
    checkedIn: false,
    checkInTime: null,
  };
  // 지금이 오전이면 오후 근무가 뒤에 예정돼 있고, 오후면 오전 근무를 이미 마쳤다
  const otherShift: HomeTodaySchedule = isMorningNow
    ? {
        scheduleIds: [102],
        label: SHIFT_LABEL.afternoon,
        start: '13:00',
        end: '15:00',
        workStatusCode: WorkStatus.SCHEDULED,
        checkedIn: false,
        checkInTime: null,
      }
    : {
        scheduleIds: [101],
        label: SHIFT_LABEL.morning,
        start: '09:00',
        end: '11:00',
        workStatusCode: WorkStatus.COMPLETED,
        checkedIn: true,
        checkInTime: '09:00',
      };

  return isMorningNow ? [currentShift, otherShift] : [otherShift, currentShift];
};

/**
 * 하루치 본인 근무 일정 목업을 만듭니다. 오늘이면 출근 흐름용 목업을, 그 외에는 시간표 목업에서
 * 본인이 신청한 칸을 정오 기준으로 나눠 오전 근무·오후 근무로 묶어 돌려줍니다.
 * @param date 날짜 (YYYY-MM-DD)
 * @param today 기준일 (오늘)
 * @returns 근무 일정 목록 (오전·오후 최대 1건씩). 근무가 없으면 빈 배열
 * @example const schedules = createMyDailySchedulesMock('2026-10-23', new Date());
 */
export const createMyDailySchedulesMock = (date: string, today: Date): HomeTodaySchedule[] => {
  const todayDate = toISO(today);
  if (date === todayDate) return createTodaySchedulesMock(today);
  if (!checkWeekday(date)) return [];

  const isPast = date < todayDate;
  const mySlots = SLOT_TIMES.map((slotTime, slotIndex) => ({ ...slotTime, slotIndex })).filter(
    ({ slotIndex }) =>
      getScheduledWorkersMock(date, slotIndex).some((worker) => worker.userId === MY_USER_ID),
  );
  const shifts = [
    { label: SHIFT_LABEL.morning, slots: mySlots.filter(({ start }) => start < '12:00') },
    { label: SHIFT_LABEL.afternoon, slots: mySlots.filter(({ start }) => start >= '12:00') },
  ];

  return shifts
    .filter(({ slots }) => slots.length > 0)
    .map(({ label, slots }) => {
      const start = slots[0]?.start ?? '';
      const end = slots.at(-1)?.end ?? '';

      return {
        scheduleIds: slots.map(({ slotIndex }) =>
          Number(`${date.replaceAll('-', '')}${slotIndex}`),
        ),
        label,
        start,
        end,
        workStatusCode: isPast ? WorkStatus.COMPLETED : WorkStatus.SCHEDULED,
        checkedIn: isPast,
        checkInTime: isPast ? start : null,
      };
    });
};

/**
 * 한 달 중 본인 근무가 있는 날짜 목록을 만듭니다.
 * @param month 그 달에 속한 아무 날짜
 * @param today 기준일 (오늘)
 * @returns 근무가 있는 날짜 목록 (YYYY-MM-DD)
 * @example const workDates = createMyWorkDatesMock(new Date(2026, 9, 1), new Date());
 */
export const createMyWorkDatesMock = (month: Date, today: Date) =>
  getMonthDates(month).filter((date) => createMyDailySchedulesMock(date, today).length > 0);
