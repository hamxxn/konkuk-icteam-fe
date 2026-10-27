import { getWorkers } from '../../_apis/workers';
import { createWorkerOptionLabel } from '../_utils/workerLabel';

/**
 * 검색 목록 글자로 근로학생을 찾습니다. 목록에서 고른 글자와 정확히 같을 때만 찾습니다.
 * @param label 검색 목록에서 고른 글자
 * @returns 그 글자의 근로학생. 없으면 undefined
 * @example findWorkerByOptionLabel('홍길동 (컴퓨터공학부 · 202312345)')?.userId; // 1
 */
export const findWorkerByOptionLabel = (label: string) =>
  getWorkers().workers.find((worker) => createWorkerOptionLabel(worker) === label);

/**
 * 검색 목록에 보여 줄 모든 근로학생 글자를 얻습니다. 정보 수정이 바로 보이도록 부를 때마다 새로 받습니다.
 * @returns 근로학생 글자 목록
 * @example getWorkerOptionLabels()[0]; // '홍길동 (컴퓨터공학부 · 202312345)'
 */
export const getWorkerOptionLabels = () => getWorkers().workers.map(createWorkerOptionLabel);
