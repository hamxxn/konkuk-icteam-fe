// 표 전체의 상태
// - read: 보기 전용. 슬롯을 클릭할 수 없다.
// - detail: 보기 전용 + 슬롯마다 신청 인원을 보여주고, 마우스를 올리면 근무자 명단을 띄운다.
// - edit: 슬롯을 눌러 추가(c)·삭제(d)를 표시하고, 다시 눌러 되돌린다(u). 관리자 승인이 필요해 '예정' 상태를 거친다.
// - apply: 근로 신청. 예정 상태 없이 누르면 바로 신청, 다시 누르면 취소된다.
export type TimeTableMode = 'read' | 'detail' | 'edit' | 'apply';

// 슬롯 하나의 상태
// - AVAILABLE: 신청 가능
// - UNAVAILABLE: 신청 불가
// - PENDING_ADD: 추가 예정
// - PENDING_DELETE: 삭제 예정
// - APPLIED: 신청 완료
export type SlotStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'PENDING_ADD' | 'PENDING_DELETE' | 'APPLIED';

// edit 모드에서 바뀐 칸 하나. 수정 요청을 보낼 때 이 목록을 쓴다.
export type SlotEdit = {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  status: SlotStatus;
};

// 표 위에 보여줄 요일 한 칸
export type TimeTableDay = {
  date: string; // YYYY-MM-DD
  label: string;
  dateLabel: string;
};

// 표 상태마다 슬롯이 가져야 하는 값이 다르다. mode로 구분하면 그 상태에 맞는 값만 요구된다.
export type SlotCellData =
  | { mode: 'read'; status: SlotStatus }
  // 슬롯에 마우스를 올리면 workers(근무자 이름) 명단을 보여준다. 신청 인원은 workers.length.
  | { mode: 'detail'; status: SlotStatus; workers: string[]; maxCount: number }
  // edit·apply는 칸을 눌러 바꾼다. disabled: 바꿀 수 없는 칸이거나 규칙(주 최대 시간 등)으로 막힌 칸
  | { mode: 'edit' | 'apply'; status: SlotStatus; onClick: () => void; disabled: boolean };

// 표가 그릴 셀 하나. 렌더링용 key만 덧붙인다.
export type TimeTableCell = SlotCellData & { key: string };

// 표가 칸 상태를 정할 때 쓰는 서버 데이터. 화면마다 조회한 응답으로 만들어 넘긴다
export type TimeTableSource = {
  // 처음(서버 기준) 내 근무·신청 칸. key는 createSlotKey로 만든다
  mySlotKeys: Set<string>;
  // detail 모드에서 칸마다 보여 줄 근무자 이름 (칸 key → 이름 목록)
  workersBySlot: Record<string, string[]>;
  // 한 칸에 함께 근무할 수 있는 최대 인원
  maxConcurrentWorkers: number;
  // 하루 통째로 근무할 수 없는 날 ('YYYY-MM-DD'). 공휴일과 관리자가 막은 날
  unavailableDates: string[];
  // 주 최대 근로시간. 채우면 빈 칸을 더 고를 수 없다
  weeklyMaxHours: number;
  // edit·apply에서 이 시각보다 먼저 시작하는 칸은 바꿀 수 없다
  editableFrom: Date;
};
