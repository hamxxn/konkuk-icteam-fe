import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// 바꾼 내용이 있을 때 화면을 떠나지 못하게 한 번 더 묻는다.
// - 뒤로가기 버튼: handleBack이 확인 모달을 연다
// - 새로고침·탭 닫기: 브라우저 기본 경고를 띄운다
export const useLeaveGuard = (hasUnsavedChanges: boolean) => {
  const router = useRouter();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setIsLeaveModalOpen(true);
      return;
    }

    router.back();
  };

  const handleLeave = () => {
    router.back();
  };

  return { isLeaveModalOpen, setIsLeaveModalOpen, handleBack, handleLeave };
};
