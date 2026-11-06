import { useEffect, useState } from 'react';

// 지금 시각을 다시 읽는 주기. 근무 칸이 시작·끝나면 근태 색과 오늘 근로 현황이 저절로 바뀐다
const CURRENT_TIME_REFRESH_MS = 30_000;

// 30초마다 새로 읽는 지금 시각
export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), CURRENT_TIME_REFRESH_MS);

    return () => window.clearInterval(timer);
  }, []);

  return currentTime;
};
