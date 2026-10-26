// 근로학생이 일할 수 있는 시간 한도. 고정값이라 프론트에서 관리한다
export const WORK_HOUR_LIMITS = {
  week: 13,
  month: 27,
} as const;

// 근무 한 번(이어진 구간)의 최소 시간
export const MIN_WORK_HOURS_PER_SHIFT = 1;

// 일정 변경(수정 요청) 규칙. 한 달에 maxPerMonth번까지, 근로 시작 deadlineHours시간 전까지 요청할 수 있다
export const SCHEDULE_CHANGE_RULES = {
  maxPerMonth: 3,
  deadlineHours: 2,
} as const;

// 누적 지각이 이 시간(분)을 넘으면 장학금 지급에 불이익이 생길 수 있다
export const LATE_LIMIT_MINUTES = 30;
