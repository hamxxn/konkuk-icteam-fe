import { cn } from '@konkuk-icteam-fe/design-system/cn';

type AuthTitleProps = {
  title: string;
  className?: string;
};

export default function AuthTitle({ title, className }: AuthTitleProps) {
  return (
    <div className={cn('mb-[2.8rem] flex flex-col gap-[1.2rem]', className)}>
      <p className='caption-12-md text-gray-400'>출근부 시스템</p>
      <h1 className='title-23-eb text-black'>{title}</h1>
    </div>
  );
}
