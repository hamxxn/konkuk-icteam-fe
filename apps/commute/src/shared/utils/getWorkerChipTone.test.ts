import { describe, expect, it } from 'vitest';
import { getWorkerChipTone } from './getWorkerChipTone';

describe('getWorkerChipTone', () => {
  it('같은 id는 숫자·글자 상관없이 늘 같은 색이다', () => {
    expect(getWorkerChipTone(3)).toBe(getWorkerChipTone('3'));
    expect(getWorkerChipTone(3)).toBe(getWorkerChipTone(3));
  });

  it('정해 둔 색 중 하나를 고른다', () => {
    [1, 2, 3, 4, 5, 6, 7, 8].forEach((id) => {
      expect(['blue', 'green', 'purple', 'red', 'black']).toContain(getWorkerChipTone(id));
    });
  });
});
