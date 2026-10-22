import { Header, ScheduleSection, WorkSummarySection } from './_components';

export default function Page() {
  return (
    <main className='bg-black-1 flex min-h-screen w-full max-w-[60rem] min-w-0 flex-col gap-[3rem] px-[2.4rem] pt-[5.8rem] pb-[4rem] text-black'>
      <Header />
      <ScheduleSection />
      <WorkSummarySection />
    </main>
  );
}
