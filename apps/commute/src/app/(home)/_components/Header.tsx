import { USER_INFO_MOCK } from '../mock';

export default function Header() {
  return (
    <header className='flex flex-col gap-[0.8rem]'>
      <p className='caption-12-md text-gray-400'>{`안녕하세요, ${USER_INFO_MOCK.userName}님!`}</p>
      <h1 className='title-26-eb text-black'>정보운영팀 출근부</h1>
    </header>
  );
}
