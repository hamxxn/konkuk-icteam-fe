export const SLOTS_PER_DAY = 18; // 09:00 ~ 18:00 까지. 일주일은 총 90개

const SLOT_START_HOUR = 9;
export const SLOT_MINUTES = 30;

const formatSlotTime = (minutesFromMidnight: number) => {
  const hour = String(Math.floor(minutesFromMidnight / 60)).padStart(2, '0');
  const minute = String(minutesFromMidnight % 60).padStart(2, '0');

  return `${hour}:${minute}`;
};

// 표가 하루에 그리는 18칸의 시간 뼈대.
// 서버가 일부 칸만 내려주더라도 표 모양이 흔들리지 않도록 여기서 기준을 잡는다.
export const SLOT_TIMES = Array.from({ length: SLOTS_PER_DAY }, (_, index) => {
  const startMinutes = SLOT_START_HOUR * 60 + index * SLOT_MINUTES;

  return {
    start: formatSlotTime(startMinutes),
    end: formatSlotTime(startMinutes + SLOT_MINUTES),
  };
});
