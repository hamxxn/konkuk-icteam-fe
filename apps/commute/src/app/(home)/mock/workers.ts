// 홈 화면 목업에서 쓰는 근로학생. 근무 일정과 업무 체크한 동료 이름을 정하는 데 쓴다
export const WORKERS_MOCK = [
  { userId: 1, name: '홍길동' },
  { userId: 2, name: '김민지' },
  { userId: 3, name: '이서준' },
  { userId: 4, name: '박하은' },
  { userId: 5, name: '최도윤' },
  { userId: 6, name: '정예린' },
];

// 로그인한 근로학생 본인 (홍길동)
export const MY_USER_ID = 1;

// 한 칸에 함께 근무할 수 있는 최대 인원
const MAX_CONCURRENT_WORKERS = 4;

/**
 * 해당 날짜·시간 칸에 근무하는 근로학생을 정합니다. 날짜와 칸 번호로만 정하므로 같은 칸은 항상 같은 결과가 나옵니다.
 * @param date 날짜 (YYYY-MM-DD)
 * @param slotIndex 하루 칸 번호 (0 = 09:00)
 * @returns 근무하는 근로학생 목록
 * @example const workers = getScheduledWorkersMock('2026-10-22', 0);
 */
export const getScheduledWorkersMock = (date: string, slotIndex: number) => {
  const dayOfMonth = Number(date.slice(8, 10));
  // 2시간(4칸) 단위로 근무자가 바뀐다
  const block = Math.floor(slotIndex / 4);

  return WORKERS_MOCK.filter((worker) => (dayOfMonth + worker.userId * 2 + block) % 3 === 0).slice(
    0,
    MAX_CONCURRENT_WORKERS,
  );
};
