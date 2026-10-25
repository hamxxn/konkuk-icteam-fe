import { getWorkers, type Worker } from '../../_apis/workers';

/**
 * 검색 결과 아래에 보여 줄 학과·학번을 만듭니다. 둘 다 없으면 빈 글자입니다.
 * @param worker 근로학생
 * @returns "학과 · 학번"
 * @example formatWorkerDetail(worker); // '컴퓨터공학부 · 202312345'
 */
export const formatWorkerDetail = ({ department, studentId }: Worker) =>
  [department, studentId].filter(Boolean).join(' · ');

/**
 * 검색 목록에 보여 줄 근로학생 글자를 만듭니다. 동명이인을 가를 수 있게 학과·학번을 괄호로 붙입니다.
 * @param worker 근로학생
 * @returns "이름 (학과 · 학번)". 학과·학번이 없으면 이름만
 * @example createWorkerOptionLabel(worker); // '홍길동 (컴퓨터공학부 · 202312345)'
 */
export const createWorkerOptionLabel = (worker: Worker) => {
  const detail = formatWorkerDetail(worker);

  return detail ? `${worker.name} (${detail})` : worker.name;
};

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
