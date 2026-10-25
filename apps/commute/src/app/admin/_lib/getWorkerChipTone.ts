import type { ChipTone } from '@/shared/ui';

// 시간표 칩 색. 사람마다 늘 같은 색이 나오도록 id로 고른다
const WORKER_CHIP_TONES: ChipTone[] = ['blue', 'green', 'purple', 'red', 'black'];

/**
 * 근무자 id로 칩 색을 고릅니다. 같은 id는 어느 화면에서나 늘 같은 색입니다.
 * @param id 근무자 id (숫자나 글자)
 * @returns 칩 색
 * @example getWorkerChipTone('3'); // 'red'
 */
export const getWorkerChipTone = (id: string | number): ChipTone => {
  const seed = Array.from(String(id)).reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return WORKER_CHIP_TONES[seed % WORKER_CHIP_TONES.length] ?? 'gray';
};
