type TodayStatusCardProps = {
  label: string;
  // 크게 보여 줄 값 (예: '2명', '3/10')
  value: string;
  // 값 아래 작은 글자 (예: 이름 목록). 넘치면 줄임표로 자르고 마우스를 올리면 모두 보인다
  detail: string;
};

// 오늘 근로 현황 카드 하나. 이름, 큰 값, 아래 작은 설명을 보여 준다
export default function TodayStatusCard({ label, value, detail }: TodayStatusCardProps) {
  return (
    <div className='flex min-w-0 flex-col gap-[0.4rem] rounded-[1.2rem] border border-gray-50 px-[2rem] py-[1.4rem]'>
      <span className='caption-14-md text-gray-500'>{label}</span>
      <strong className='title-20-bd text-black'>{value}</strong>
      <span title={detail} className='caption-12-md truncate text-gray-500'>
        {detail}
      </span>
    </div>
  );
}
