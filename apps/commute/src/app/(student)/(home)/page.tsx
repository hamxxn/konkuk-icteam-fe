import {
  ApplyOpenBanner,
  Header,
  NoticeSection,
  ScheduleSection,
  WorkSummarySection,
} from './_components';

export default function Page() {
  return (
    <main className='bg-black-1 flex min-h-screen w-full flex-col gap-[3rem] px-[2.4rem] pt-[5.8rem] pb-[9.6rem] text-black'>
      <Header />
      <ApplyOpenBanner />
      <NoticeSection />
      <ScheduleSection />
      <WorkSummarySection />
    </main>
  );
}
