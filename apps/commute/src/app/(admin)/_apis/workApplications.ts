import {
  parseApiDate,
  parseApiDateTime,
  toApiDate,
  toApiDateTime,
  type ApiJson,
} from '@/shared/apis/common';
import { getWorkApplicationMock, saveWorkApplicationMock } from './mock/workApplications';

// 한 달 근로신청 기준. 시간은 모두 시간 단위다
export type WorkApplicationSettings = {
  // 근로학생이 근무 시간을 신청할 수 있는 기간 (보통 전달). 날짜와 시각을 함께 정한다
  // JSON으로는 'YYYY-MM-DDTHH:mm:ss'로 주고받는다
  applyStartDate: Date;
  applyEndDate: Date;
  // 한 칸(30분)에 함께 근무할 수 있는 최대 인원
  maxConcurrentWorkers: number;
  weeklyMinHours: number;
  weeklyMaxHours: number;
  monthlyMinHours: number;
  monthlyMaxHours: number;
  // 근무할 수 없는 날. 주말·공휴일은 원래 근무가 없어서 넣지 않는다
  unavailableDates: Date[];
};

export type GetWorkApplicationRequest = {
  year: number;
  // 1~12
  month: number;
};

export type GetWorkApplicationResponse = {
  year: number;
  month: number;
  // 관리자가 그 달 신청을 열었는지. 열지 않은 달은 settings가 null이고 userIds가 빈 배열이다
  isOpened: boolean;
  settings: WorkApplicationSettings | null;
  // 그 달 근무를 신청할 수 있는 근로학생 (= 그 달 근로학생 명단)
  userIds: number[];
};

// 처음 저장하면 그 달 신청이 열린다. 이미 연 달을 다시 저장하면 지금까지 들어온 근로신청은 모두 초기화된다
export type SaveWorkApplicationRequest = {
  year: number;
  month: number;
  settings: WorkApplicationSettings;
  userIds: number[];
};

export type SaveWorkApplicationResponse = GetWorkApplicationResponse;

const toSettings = (json: ApiJson<WorkApplicationSettings>): WorkApplicationSettings => ({
  ...json,
  applyStartDate: parseApiDateTime(json.applyStartDate),
  applyEndDate: parseApiDateTime(json.applyEndDate),
  unavailableDates: json.unavailableDates.map(parseApiDate),
});

const toSettingsJson = (settings: WorkApplicationSettings): ApiJson<WorkApplicationSettings> => ({
  ...settings,
  applyStartDate: toApiDateTime(settings.applyStartDate),
  applyEndDate: toApiDateTime(settings.applyEndDate),
  unavailableDates: settings.unavailableDates.map(toApiDate),
});

/**
 * GET /admin/work-applications?year=&month=
 * 그 달 근로신청 기준과 신청할 수 있는 근로학생
 */
export const getWorkApplication = ({
  year,
  month,
}: GetWorkApplicationRequest): GetWorkApplicationResponse => {
  const saved = getWorkApplicationMock(year, month);

  return saved
    ? { year, month, isOpened: true, settings: toSettings(saved.settings), userIds: saved.userIds }
    : { year, month, isOpened: false, settings: null, userIds: [] };
};

/**
 * PUT /admin/work-applications
 * 그 달 신청을 열거나 기준을 바꾼다
 */
export const saveWorkApplication = ({
  year,
  month,
  settings,
  userIds,
}: SaveWorkApplicationRequest): SaveWorkApplicationResponse => {
  saveWorkApplicationMock(year, month, { settings: toSettingsJson(settings), userIds });

  return getWorkApplication({ year, month });
};
