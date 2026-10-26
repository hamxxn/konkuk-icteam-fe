import { describe, expect, it } from 'vitest';
import { getWorkers } from '../../_apis/workers';
import {
  createWorkerOptionLabel,
  findWorkerByOptionLabel,
  formatWorkerDetail,
} from './workerSearch';

describe('workerSearch', () => {
  it('학과·학번을 이어 붙이고, 없는 값은 뺀다', () => {
    const [worker] = getWorkers().workers;
    if (!worker) throw new Error('목업 근로장학생이 없습니다.');

    expect(formatWorkerDetail(worker)).toBe('컴퓨터공학부 · 202312345');
    expect(formatWorkerDetail({ ...worker, department: null })).toBe('202312345');
    expect(formatWorkerDetail({ ...worker, department: null, studentId: null })).toBe('');
  });

  it('동명이인을 가르도록 이름 뒤에 학과·학번을 붙이고, 없으면 이름만 쓴다', () => {
    const [worker] = getWorkers().workers;
    if (!worker) throw new Error('목업 근로장학생이 없습니다.');

    expect(createWorkerOptionLabel(worker)).toBe('홍길동 (컴퓨터공학부 · 202312345)');
    expect(createWorkerOptionLabel({ ...worker, department: null, studentId: null })).toBe(
      '홍길동',
    );
  });

  it('목록 글자와 정확히 같을 때만 근로학생을 찾는다', () => {
    expect(findWorkerByOptionLabel('홍길동 (컴퓨터공학부 · 202312345)')?.userId).toBe(1);
    expect(findWorkerByOptionLabel('홍길동')).toBeUndefined();
  });
});
