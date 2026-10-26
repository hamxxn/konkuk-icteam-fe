import { WORKERS_MOCK } from '@/app/(admin)/_apis/mock/workers';

// 근로학생 화면 목업은 관리자 목업 저장소를 함께 읽는다. 관리자 화면에서 바꾼 공지·업무 지정·배치가 그대로 보인다

// 로그인한 근로학생 본인 (홍길동)
export const MY_USER_ID = 1;

export const getMyNameMock = () =>
  WORKERS_MOCK.find(({ userId }) => userId === MY_USER_ID)?.name ?? '';
