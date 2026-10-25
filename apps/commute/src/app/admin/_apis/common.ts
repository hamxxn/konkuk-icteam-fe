import { parseISO, toISO } from '@konkuk-icteam-fe/design-system/date';

/*
 * 어드민 API 공통 규칙
 * - 경로는 모두 /admin 으로 시작한다. 파일 하나가 리소스 하나이고, 함수마다 위에 메서드·경로를 적는다
 * - 요청·응답 타입의 날짜는 Date다. JSON으로 주고받을 때는 아래 문자열로 보낸다
 *   - 날짜만: 'YYYY-MM-DD' (예: '2026-10-25')
 *   - 날짜와 시각: 'YYYY-MM-DDTHH:mm:ss' (한국 시간, 시간대 표기 없음)
 * - 날짜 없이 시각만 있는 값은 'HH:mm' 문자열이다 (예: '09:00'). 근무 칸은 한 시간 단위다
 * - 아직 서버가 없어서 함수는 mock 폴더의 JSON(서버가 보낼 모양 그대로)을 Date로 바꿔 돌려준다.
 *   서버를 붙이면 함수 안만 실제 요청으로 바꾸고, 그때 반환값이 Promise가 된다
 */

// 'HH:mm'
export type TimeString = string;

// 서버가 실제로 보내는 JSON 모양. 타입의 Date 자리가 문자열이 된다
export type ApiJson<T> = T extends Date
  ? string
  : T extends (infer Item)[]
    ? ApiJson<Item>[]
    : T extends object
      ? { [Key in keyof T]: ApiJson<T[Key]> }
      : T;

/**
 * 날짜를 요청에 실을 문자열로 바꿉니다.
 * @param date 날짜
 * @returns YYYY-MM-DD
 * @example toApiDate(new Date(2026, 9, 25)); // '2026-10-25'
 */
export const toApiDate = (date: Date) => toISO(date);

/**
 * 응답의 날짜 문자열을 Date로 바꿉니다.
 * @param value YYYY-MM-DD
 * @returns 그날 0시 (한국 시간)
 * @example parseApiDate('2026-10-25').getDate(); // 25
 */
export const parseApiDate = (value: string) => parseISO(value);

/**
 * 날짜·시각을 요청에 실을 문자열로 바꿉니다. 초는 버립니다.
 * @param date 날짜·시각
 * @returns YYYY-MM-DDTHH:mm:00 (한국 시간)
 * @example toApiDateTime(new Date(2026, 9, 20, 9, 0)); // '2026-10-20T09:00:00'
 */
export const toApiDateTime = (date: Date) =>
  `${toISO(date)}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;

/**
 * 응답의 날짜·시각 문자열을 Date로 바꿉니다.
 * @param value YYYY-MM-DDTHH:mm:ss
 * @returns 그 시각 (한국 시간)
 * @example parseApiDateTime('2026-10-22T10:12:00').getHours(); // 10
 */
export const parseApiDateTime = (value: string) => new Date(value);
