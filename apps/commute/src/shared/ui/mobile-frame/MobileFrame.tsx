type MobileFrameProps = {
  children: React.ReactNode;
};

// 근로학생 화면을 휴대폰 폭(45rem)으로 가운데에 세운다. 관리자 화면은 전체 폭을 써서 이 틀을 쓰지 않는다
export default function MobileFrame({ children }: MobileFrameProps) {
  return <div className='mx-auto flex min-h-screen max-w-[45rem] justify-center'>{children}</div>;
}
