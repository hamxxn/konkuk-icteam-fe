import RequestNoticeBar from './_components/RequestNoticeBar';
import PageClient from './page.client';

export default function Page() {
  return (
    <div className='mx-auto flex w-full max-w-[130.3rem] flex-col gap-[2.4rem] p-[3.4rem]'>
      <RequestNoticeBar />
      <PageClient />
    </div>
  );
}
