import { cn } from '@konkuk-icteam-fe/design-system/cn';

type FieldErrorProps = {
  // 입력칸의 aria-describedby로 이어 줄 id
  id?: string;
  message?: string;
  className?: string;
};

// 입력칸 바로 아래 붙는 오류 글자. 오류가 없으면 그리지 않는다
export default function FieldError({ id, message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p id={id} className={cn('caption-12-md text-red', className)}>
      {message}
    </p>
  );
}
