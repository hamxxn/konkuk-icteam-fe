import TodayStatusBar from './_components/today-status/TodayStatusBar';
import PageClient from './page.client';

export default function Page() {
  return (
    <div className='mx-auto flex w-full max-w-[130.3rem] flex-col gap-[2.4rem] p-[3.4rem]'>
      <TodayStatusBar />
      <PageClient />
    </div>
  );
}
