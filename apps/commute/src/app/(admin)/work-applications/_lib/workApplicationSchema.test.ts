import { describe, expect, it } from 'vitest';
import { workApplicationSchema, type WorkApplication } from './workApplicationSchema';

const createApplication = (
  settings: Partial<WorkApplication['settings']> = {},
  userIds = [1],
): WorkApplication => ({
  settings: {
    applyStartDate: new Date(2026, 9, 20, 9),
    applyEndDate: new Date(2026, 9, 25, 18),
    maxConcurrentWorkers: 4,
    weeklyMinHours: 6,
    weeklyMaxHours: 15,
    monthlyMinHours: 30,
    monthlyMaxHours: 60,
    unavailableDates: [],
    ...settings,
  },
  userIds,
});

const getErrorPaths = (application: WorkApplication) =>
  workApplicationSchema.safeParse(application).error?.issues.map(({ path }) => path.join('.')) ??
  [];

describe('workApplicationSchema', () => {
  it('기준이 알맞으면 통과한다', () => {
    expect(workApplicationSchema.safeParse(createApplication()).success).toBe(true);
  });

  it('신청 마감이 시작보다 늦지 않으면 마감 칸에 오류를 붙인다', () => {
    const sameTime = new Date(2026, 9, 20, 9);

    expect(
      getErrorPaths(createApplication({ applyStartDate: sameTime, applyEndDate: sameTime })),
    ).toEqual(['settings.applyEndDate']);
  });

  it('동시 근무 최대 인원은 1명 이상이어야 한다', () => {
    expect(getErrorPaths(createApplication({ maxConcurrentWorkers: 0 }))).toEqual([
      'settings.maxConcurrentWorkers',
    ]);
  });

  it('주간·월간 최소 근로시간이 최대보다 크면 최대 칸에 오류를 붙인다', () => {
    expect(getErrorPaths(createApplication({ weeklyMinHours: 20 }))).toEqual([
      'settings.weeklyMaxHours',
    ]);
    expect(getErrorPaths(createApplication({ monthlyMinHours: 70 }))).toEqual([
      'settings.monthlyMaxHours',
    ]);
  });

  it('근로학생을 한 명도 고르지 않으면 안 된다', () => {
    expect(getErrorPaths(createApplication({}, []))).toEqual(['userIds']);
  });
});
