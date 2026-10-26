import { z } from 'zod';

// 근로신청 기준. 칸끼리 비교하는 규칙은 화면에 안내할 칸(path)에 오류를 붙인다
const workApplicationSettingsSchema = z
  .object({
    applyStartDate: z.date(),
    applyEndDate: z.date(),
    maxConcurrentWorkers: z.number(),
    weeklyMinHours: z.number(),
    weeklyMaxHours: z.number(),
    monthlyMinHours: z.number(),
    monthlyMaxHours: z.number(),
    unavailableDates: z.array(z.date()),
  })
  .refine(({ applyStartDate, applyEndDate }) => applyStartDate < applyEndDate, {
    message: '신청 마감이 시작보다 늦어야 해요.',
    path: ['applyEndDate'],
  })
  .refine(({ maxConcurrentWorkers }) => maxConcurrentWorkers >= 1, {
    message: '동시 근무 최대 인원은 1명 이상이어야 해요.',
    path: ['maxConcurrentWorkers'],
  })
  .refine(({ weeklyMinHours, weeklyMaxHours }) => weeklyMinHours <= weeklyMaxHours, {
    message: '주간 최소 근로시간이 최대보다 커요.',
    path: ['weeklyMaxHours'],
  })
  .refine(({ monthlyMinHours, monthlyMaxHours }) => monthlyMinHours <= monthlyMaxHours, {
    message: '월간 최소 근로시간이 최대보다 커요.',
    path: ['monthlyMaxHours'],
  });

// 한 달치 근로신청. 고른 학생만 그 달 근무를 신청할 수 있다
export const workApplicationSchema = z.object({
  settings: workApplicationSettingsSchema,
  userIds: z.array(z.number()).min(1, '근로학생을 한 명 이상 골라 주세요.'),
});

export type WorkApplication = z.infer<typeof workApplicationSchema>;

// 설정 칸별 오류 글자. 칸끼리 비교하는 규칙은 뒤쪽 칸(마감일·최대)에 붙는다
export type SettingsErrors = Partial<Record<keyof WorkApplication['settings'], string>>;
