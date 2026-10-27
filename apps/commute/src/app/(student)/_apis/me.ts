import { getMyNameMock, MY_USER_ID } from './mock/me';

// 로그인한 근로학생 본인
export type Me = {
  userId: number;
  name: string;
};

/**
 * GET /me
 * 로그인한 근로학생 본인 정보
 */
export const getMe = (): Me => ({ userId: MY_USER_ID, name: getMyNameMock() });
