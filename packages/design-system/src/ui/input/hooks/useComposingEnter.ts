import { useRef } from 'react';

// 사파리가 조합을 끝낸 직후 보내는 Enter의 keyCode (IME 처리 중인 키)
const IME_PROCESS_KEY_CODE = 229;

/**
 * 한글처럼 조합 중인 글자에서 누른 Enter를 조합이 끝난 뒤 한 번만 처리합니다.
 * 조합 중 Enter는 브라우저가 글자 확정에 먼저 쓰기 때문에, 확정된 글자로 다시 처리해야 합니다.
 * - 크롬: 조합 중에 Enter keydown이 먼저 오고, 그다음 조합이 끝납니다
 * - 사파리: 조합이 먼저 끝나고, 그 뒤 keyCode 229인 Enter가 옵니다
 * @param handleConfirmedEnter 조합이 끝난 뒤 실행할 함수. 확정된 입력값을 받습니다
 * @returns 입력칸의 onKeyDown·onCompositionEnd에 연결할 함수
 * @example
 * const { handleComposingEnter, handleCompositionEnd } = useComposingEnter(selectFirst);
 * const handleKeyDown = (event) => {
 *   if (handleComposingEnter(event)) return;
 *   // 조합과 상관없는 Enter 처리
 * };
 */
const useComposingEnter = (handleConfirmedEnter: (value: string) => void) => {
  const isEnterWhileComposingRef = useRef(false);

  // 조합 때문에 미뤄지거나 지금 처리한 Enter면 true. 그 밖의 키는 false라 호출한 쪽이 이어서 처리한다
  const handleComposingEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return false;

    if (event.nativeEvent.isComposing) {
      isEnterWhileComposingRef.current = true;
      return true;
    }

    if (event.keyCode === IME_PROCESS_KEY_CODE) {
      handleConfirmedEnter(event.currentTarget.value);
      return true;
    }

    return false;
  };

  const handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
    if (!isEnterWhileComposingRef.current) return;

    isEnterWhileComposingRef.current = false;
    handleConfirmedEnter(event.currentTarget.value);
  };

  return { handleComposingEnter, handleCompositionEnd };
};

export default useComposingEnter;
