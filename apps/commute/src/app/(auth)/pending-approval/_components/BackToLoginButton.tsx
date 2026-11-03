'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';

// 로그인 화면으로 돌아가는 버튼
export default function BackToLoginButton() {
  const router = useRouter();

  return (
    <Button color='blue' onClick={() => router.push(ROUTES.LOGIN)}>
      로그인 화면으로
    </Button>
  );
}
