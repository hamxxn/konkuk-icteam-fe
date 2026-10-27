import { convertMinutesToTime, convertTimeToMinutes } from '@/shared/utils/time';

/**
 * 칸 하나를 가리키는 key를 만듭니다.
 * @param dateKey 날짜 'YYYY-MM-DD'
 * @param startTime 칸 시작 시각 'HH:mm'
 * @returns 'YYYY-MM-DD HH:mm'
 * @example const key = createSlotKey('2026-10-27', '09:00'); // '2026-10-27 09:00'
 */
export const createSlotKey = (dateKey: string, startTime: string) => `${dateKey} ${startTime}`;

/**
 * 칸들을 날짜별로 이어진 구간으로 묶습니다. 요청·신청을 보낼 때 씁니다.
 * @param slots 칸 목록
 * @param slots[].date 날짜 'YYYY-MM-DD'
 * @param slots[].startTime 칸 시작 시각 'HH:mm'
 * @param slotMinutes 칸 하나의 길이 (분)
 * @returns 날짜·시작 시각 순으로 정렬한 구간 목록 (date는 'YYYY-MM-DD', start·end는 'HH:mm')
 * @example const ranges = mergeSlotsToRanges([{ date: '2026-10-27', startTime: '09:00' }, { date: '2026-10-27', startTime: '10:00' }], 60); // [{ date: '2026-10-27', start: '09:00', end: '11:00' }]
 */
export const mergeSlotsToRanges = (
  slots: { date: string; startTime: string }[],
  slotMinutes: number,
) => {
  const sortedSlots = [...slots].sort((a, b) =>
    createSlotKey(a.date, a.startTime).localeCompare(createSlotKey(b.date, b.startTime)),
  );

  return sortedSlots.reduce<{ date: string; start: string; end: string }[]>((ranges, slot) => {
    const startMinutes = convertTimeToMinutes(slot.startTime);
    const end = convertMinutesToTime(startMinutes + slotMinutes);
    const lastRange = ranges.at(-1);
    const isContinued =
      lastRange?.date === slot.date && convertTimeToMinutes(lastRange.end) === startMinutes;

    return isContinued
      ? [...ranges.slice(0, -1), { ...lastRange, end }]
      : [...ranges, { date: slot.date, start: slot.startTime, end }];
  }, []);
};
