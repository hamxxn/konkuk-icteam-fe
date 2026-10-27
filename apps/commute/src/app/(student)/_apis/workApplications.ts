import {
  parseApiDate,
  parseApiDateTime,
  toApiDate,
  type ApiJson,
  type WorkTimeRange,
} from './common';
import {
  getMyWorkApplicationMock,
  getWorkApplicationSettingsMock,
  saveMyWorkApplicationMock,
} from './mock/workApplications';

// 한 달 근로신청 기준. 관리자가 정한다 (관리자 WorkApplicationSettings와 같은 모양). 시간은 모두 시간 단위다
export type WorkApplicationSettings = {
  // 근무 시간을 신청할 수 있는 기간 (보통 전달). 날짜와 시각까지 정해져 있다
  applyStartDate: Date;
  applyEndDate: Date;
  // 한 칸(30분)에 함께 근무할 수 있는 최대 인원
  maxConcurrentWorkers: number;
  weeklyMinHours: number;
  weeklyMaxHours: number;
  monthlyMinHours: number;
  monthlyMaxHours: number;
  // 근무할 수 없는 날. 주말·공휴일은 원래 근무가 없어서 들어 있지 않다
  unavailableDates: Date[];
};

export type GetWorkApplicationSettingsRequest = {
  year: number;
  // 1~12
  month: number;
};

export type GetWorkApplicationSettingsResponse = {
  year: number;
  month: number;
  // 관리자가 그 달 신청을 열었는지. 열지 않은 달은 settings가 null이다
  isOpened: boolean;
  settings: WorkApplicationSettings | null;
  // 내가 그 달 근로학생 명단에 들어 있어 신청할 수 있는지
  canApply: boolean;
};

export type GetMyWorkApplicationRequest = GetWorkApplicationSettingsRequest;

export type GetMyWorkApplicationResponse = {
  year: number;
  month: number;
  // 내가 신청한 근무. 30분 칸이 이어지면 한 구간으로 온다
  schedules: WorkTimeRange[];
};

// 그 달 신청을 통째로 바꾼다. 신청 기간 안에서만 할 수 있다
export type SaveMyWorkApplicationRequest = GetMyWorkApplicationResponse;

export type SaveMyWorkApplicationResponse = GetMyWorkApplicationResponse;

const toSettings = (json: ApiJson<WorkApplicationSettings>): WorkApplicationSettings => ({
  ...json,
  applyStartDate: parseApiDateTime(json.applyStartDate),
  applyEndDate: parseApiDateTime(json.applyEndDate),
  unavailableDates: json.unavailableDates.map(parseApiDate),
});

const toWorkTimeRange = (json: ApiJson<WorkTimeRange>): WorkTimeRange => ({
  ...json,
  date: parseApiDate(json.date),
});

/**
 * GET /me/work-applications/settings?year=&month=
 * 그 달 근로신청 기준과 내가 신청할 수 있는지
 */
export const getWorkApplicationSettings = ({
  year,
  month,
}: GetWorkApplicationSettingsRequest): GetWorkApplicationSettingsResponse => {
  const saved = getWorkApplicationSettingsMock(year, month);

  return saved
    ? {
        year,
        month,
        isOpened: true,
        settings: toSettings(saved.settings),
        canApply: saved.canApply,
      }
    : { year, month, isOpened: false, settings: null, canApply: false };
};

/**
 * GET /me/work-applications?year=&month=
 * 그 달 내가 신청한 근무
 */
export const getMyWorkApplication = ({
  year,
  month,
}: GetMyWorkApplicationRequest): GetMyWorkApplicationResponse => ({
  year,
  month,
  schedules: getMyWorkApplicationMock(year, month).map(toWorkTimeRange),
});

/**
 * PUT /me/work-applications
 * body: { year, month, schedules }
 */
export const saveMyWorkApplication = ({
  year,
  month,
  schedules,
}: SaveMyWorkApplicationRequest): SaveMyWorkApplicationResponse => {
  saveMyWorkApplicationMock(
    year,
    month,
    schedules.map((schedule) => ({ ...schedule, date: toApiDate(schedule.date) })),
  );

  return getMyWorkApplication({ year, month });
};
