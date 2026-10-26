// 어느 화면에서나 쓰는 날짜 변환. 문자열 날짜는 모두 YYYY-MM-DD(로컬 기준)다.

/**
 * 숫자를 2자리로 패딩합니다. (예: 5 -> "05")
 * @param num 숫자
 * @returns 2자리로 패딩된 문자열
 * @example const padded = formatNumber(5); // '05'
 */
export const formatNumber = (num: number) => String(num).padStart(2, '0');

/**
 * 날짜를 ISO 형식(YYYY-MM-DD)으로 변환합니다.
 * @param date 날짜 객체
 * @returns ISO 형식 문자열 (YYYY-MM-DD)
 * @example const isoString = toISO(new Date(2024, 0, 15)); // '2024-01-15'
 */
export const toISO = (date: Date) => {
  const y = date.getFullYear();
  const m = formatNumber(date.getMonth() + 1);
  const d = formatNumber(date.getDate());
  return `${y}-${m}-${d}`;
};

/**
 * ISO 형식(YYYY-MM-DD) 문자열을 로컬 시간 기준 날짜 객체로 변환합니다.
 * (new Date('YYYY-MM-DD')는 UTC로 해석되어 시간대에 따라 하루가 어긋날 수 있어 직접 파싱합니다)
 * @param iso ISO 형식 문자열 (YYYY-MM-DD)
 * @returns 로컬 시간 기준 날짜 객체
 * @example const date = parseISO('2024-01-15'); // 2024년 1월 15일 (로컬)
 */
export const parseISO = (iso: string) => {
  const [year = 0, month = 1, day = 1] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * 해당 날짜의 월 시작일을 반환합니다.
 * @param date 날짜 객체
 * @returns 해당 월의 시작일 날짜 객체
 * @example const start = startOfMonth(new Date(2024, 0, 15)); // 2024년 1월 1일
 */
export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

/**
 * 날짜에 월 단위로 델타를 더한 새로운 날짜 객체를 반환합니다.
 * @param date 기준 날짜 객체
 * @param delta 더할 월 수 (음수 가능)
 * @returns 새로운 날짜 객체 (월의 첫째 날)
 * @example const nextMonth = addMonths(new Date(2024, 0, 15), 1); // 2024년 2월 1일
 */
export const addMonths = (date: Date, delta: number) =>
  new Date(date.getFullYear(), date.getMonth() + delta, 1);

/**
 * 해당 날짜가 속한 월의 총 일수를 반환합니다.
 * @param date 날짜 객체
 * @returns 해당 월의 총 일수
 * @example const totalDays = daysInMonth(new Date(2024, 1, 1)); // 29 (2024년 2월)
 */
export const daysInMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

/**
 * 두 ISO 형식 날짜 문자열을 비교합니다.
 * @param a 첫 번째 ISO 형식 문자열
 * @param b 두 번째 ISO 형식 문자열
 * @returns 비교 결과 (음수: a < b, 0: a == b, 양수: a > b)
 * @example const result = compareISO('2024-01-15', '2024-01-20'); // result < 0
 */
export const compareISO = (a: string, b: string) => a.localeCompare(b);
