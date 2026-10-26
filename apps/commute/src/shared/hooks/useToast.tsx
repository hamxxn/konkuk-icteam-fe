'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { Message } from '@konkuk-icteam-fe/design-system/ui';

type ToastVariant = 'help' | 'error' | 'success';

type ToastState = {
  message: string;
  variant: ToastVariant;
  // 같은 글자를 다시 띄워도 닫히는 시간을 처음부터 다시 세게 한다
  shownAt: number;
};

/**
 * 잠깐 떴다 사라지는 알림을 다룹니다. 글자는 디자인 시스템 Message로 그립니다.
 * @param duration 떠 있는 시간 (ms, 기본값: 2000)
 * @returns showToast로 알림을 띄우고, toast를 화면 아무 곳에 그려 둔다
 * @example
 * const { showToast, toast } = useToast();
 * showToast('저장했어요.');
 * return <>{children}{toast}</>;
 */
export const useToast = (duration = 2000) => {
  const messageId = useId();
  const [state, setState] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!state) return;

    const timeoutId = window.setTimeout(() => setState(null), duration);

    return () => window.clearTimeout(timeoutId);
  }, [state, duration]);

  // 하위 컴포넌트에 넘겨도 그릴 때마다 새 함수가 되지 않게 고정한다
  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    setState({ message, variant, shownAt: Date.now() });
  }, []);

  const toast = (
    <div
      role='status'
      aria-live='polite'
      className='pointer-events-none fixed inset-x-0 top-[10rem] z-60 flex justify-center px-[2rem]'
    >
      {state ? (
        <div className='bg-black-1 shadow-[0_0_12px_0_rgba(57, 54, 74, 0.14)] rounded-[0.8rem] px-[1.6rem] py-[0.8rem]'>
          <Message id={messageId} message={state.message} variant={state.variant} showIcon />
        </div>
      ) : null}
    </div>
  );

  return { showToast, toast };
};
