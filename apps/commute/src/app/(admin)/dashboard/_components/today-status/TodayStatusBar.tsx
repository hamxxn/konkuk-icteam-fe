'use client';

import { toISO } from '@konkuk-icteam-fe/design-system/date';
import { getAttendances } from '../../../_apis/attendances';
import { getTodoProgress } from '../../../_apis/todos';
import { useCurrentTime } from '../../_hooks/useCurrentTime';
import { getTodayAttendanceSummary, type AttendanceUser } from '../../_utils/attendanceStatus';
import RequestNoticeCard from './RequestNoticeCard';
import TodayStatusCard from './TodayStatusCard';

/**
 * 카드 아래에 보여 줄 이름 목록을 만듭니다.
 * @param users 사람 목록
 * @returns '홍길동 · 김민지'. 아무도 없으면 '없음'
 * @example createUserNames([{ userId: 1, userName: '홍길동' }]); // '홍길동'
 */
const createUserNames = (users: AttendanceUser[]) =>
  users.length > 0 ? users.map(({ userName }) => userName).join(' · ') : '없음';

// 대시보드 맨 위 줄. 오늘 근무중·출근 예정·지각/결근 인원과 업무 완료 현황을 보여 주고, 끝에 처리할 승인 요청을 알린다.
// 날짜 카드에서 다른 날을 골라도 이 줄은 늘 오늘이다
export default function TodayStatusBar() {
  const currentTime = useCurrentTime();
  const todayKey = toISO(currentTime);
  const { shifts } = getAttendances({ date: currentTime });
  const { workingUsers, upcomingUsers, lateOrAbsentUsers } = getTodayAttendanceSummary(
    todayKey,
    shifts,
    currentTime,
  );
  const { totalCount, completedCount } = getTodoProgress({ date: currentTime });

  return (
    <section
      aria-label='오늘 근로 현황'
      className='grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)] gap-[1.2rem]'
    >
      <TodayStatusCard
        label='근무 중'
        value={`${workingUsers.length}명`}
        detail={createUserNames(workingUsers)}
      />
      <TodayStatusCard
        label='출근 예정'
        value={`${upcomingUsers.length}명`}
        detail={createUserNames(upcomingUsers)}
      />
      <TodayStatusCard
        label='지각 / 결근'
        value={`${lateOrAbsentUsers.length}명`}
        detail={createUserNames(lateOrAbsentUsers)}
      />
      <TodayStatusCard
        label='업무 현황'
        value={`${completedCount}/${totalCount}`}
        detail={
          totalCount === completedCount ? '모두 완료' : `남은 업무 ${totalCount - completedCount}건`
        }
      />
      <RequestNoticeCard />
    </section>
  );
}
