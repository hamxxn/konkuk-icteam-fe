// 주·월 근로시간 기준(최소·최대)과 동시 근무 인원은 관리자가 달마다 정한다 (WorkApplicationSettings)
// 여기에는 달마다 바뀌지 않는 규칙만 둔다

// 근무 한 번(이어진 구간)의 최소 시간
export const MIN_WORK_HOURS_PER_SHIFT = 1;

// 일정 변경(수정 요청) 규칙. 한 달에 maxPerMonth번까지, 근로 시작 deadlineHours시간 전까지 요청할 수 있다
export const SCHEDULE_CHANGE_RULES = {
  maxPerMonth: 3,
  deadlineHours: 2,
} as const;

// 누적 지각이 이 시간(분)을 넘으면 장학금 지급에 불이익이 생길 수 있다
export const LATE_LIMIT_MINUTES = 30;
