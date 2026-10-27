import type { Worker } from '../../_apis/workers';

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
