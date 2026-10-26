import { toISO } from '@konkuk-icteam-fe/design-system/date';
import {
  getDaySlotsMock,
  getMaxConcurrentWorkersMock,
} from '@/app/(admin)/_apis/mock/workSchedules';
import type { ApiJson } from '../common';
import type { WorkScheduleSlot } from '../workSchedules';
import { getMyNameMock, MY_USER_ID } from './me';

// 오늘 데모용으로 나를 넣어 두는 오전 근무 칸. 이미 출근한 근무중 상태로 두어 업무 체크리스트를 펼쳐 볼 수 있다
export const DEMO_MORNING_SLOT_STARTS = ['09:00', '10:00'];

/**
 * 오늘 근무 상태를 언제 열어도 볼 수 있게 데모로 나를 넣을 칸인지 확인합니다. 평일 오늘의 09~11시 칸과,
 * 근무 시간 안이면 지금 시각 칸(출근하기 버튼용)입니다.
 * 관리자 목업 저장소는 바꾸지 않습니다. 저장소를 바꾸면 서버·브라우저의 관리자 화면이 서로 달라져 hydration 오류가 납니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param start 칸 시작 시각 (HH:mm)
 * @param now 기준 시각
 * @returns 데모로 나를 넣을 칸이면 true
 * @example checkDemoSlot('2026-10-27', '09:00', new Date(2026, 9, 27, 8, 30)); // true
 */
const checkDemoSlot = (dateKey: string, start: string, now: Date) => {
  const isWeekday = now.getDay() !== 0 && now.getDay() !== 6;
  if (!isWeekday || dateKey !== toISO(now)) return false;

  return DEMO_MORNING_SLOT_STARTS.includes(start) || Number(start.slice(0, 2)) === now.getHours();
};

/**
 * 데모 칸의 배치 id를 만듭니다. 관리자 목업 배치 id와 겹치지 않게 앞에 9를 붙입니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @param start 칸 시작 시각 (HH:mm)
 * @returns 배치 id
 * @example createDemoScheduleId('2026-10-27', '09:00'); // 92026102709
 */
const createDemoScheduleId = (dateKey: string, start: string) =>
  Number(`9${dateKey.replaceAll('-', '')}${start.slice(0, 2)}`);

/**
 * 그날 팀 근무 칸 목업을 얻습니다. 관리자 근무 시간표 목업에 오늘 데모 칸의 나를 덧붙입니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @returns 한 시간 단위 근무 칸 JSON
 * @example getTeamDaySlotsMock('2026-10-27')[0]?.users;
 */
export const getTeamDaySlotsMock = (dateKey: string): ApiJson<WorkScheduleSlot>[] => {
  const now = new Date();

  return getDaySlotsMock(dateKey).map((slot) => {
    const isAlreadyMine = slot.users.some(({ userId }) => userId === MY_USER_ID);
    if (isAlreadyMine || !checkDemoSlot(dateKey, slot.start, now)) return slot;

    return {
      ...slot,
      users: [
        ...slot.users,
        {
          scheduleId: createDemoScheduleId(dateKey, slot.start),
          userId: MY_USER_ID,
          userName: getMyNameMock(),
        },
      ],
    };
  });
};

export const getTeamMaxConcurrentWorkersMock = (year: number, month: number) =>
  getMaxConcurrentWorkersMock(year, month);

/**
 * 그날 내가 배치된 칸 목업을 얻습니다.
 * @param dateKey 날짜 (YYYY-MM-DD)
 * @returns 내가 배치된 칸의 시작·끝 시각과 배치 id
 * @example getMyDaySlotsMock('2026-10-27'); // [{ start: '09:00', end: '10:00', scheduleId: ... }]
 */
export const getMyDaySlotsMock = (dateKey: string) =>
  getTeamDaySlotsMock(dateKey).flatMap(({ start, end, users }) => {
    const mine = users.find(({ userId }) => userId === MY_USER_ID);

    return mine ? [{ start, end, scheduleId: mine.scheduleId }] : [];
  });
