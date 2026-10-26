import { formatNumber } from '@konkuk-icteam-fe/design-system/date';

// 근무 칸은 한 시간 단위이고 09:00 ~ 18:00 까지 하루 9칸이다 (관리자 시간표와 같다)
const FIRST_SLOT_HOUR = 9;
const LAST_SLOT_HOUR = 18;

export const SLOT_MINUTES = 60;

export const SLOTS_PER_DAY = LAST_SLOT_HOUR - FIRST_SLOT_HOUR;

// 하루 9칸의 시간 뼈대. 서버가 일부 칸만 내려주더라도 표 모양이 흔들리지 않도록 여기서 기준을 잡는다
export const SLOT_TIMES = Array.from({ length: SLOTS_PER_DAY }, (_, index) => ({
  start: `${formatNumber(FIRST_SLOT_HOUR + index)}:00`,
  end: `${formatNumber(FIRST_SLOT_HOUR + index + 1)}:00`,
}));
