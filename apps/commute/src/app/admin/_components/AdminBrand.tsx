import Image from 'next/image';

// 관리자 화면 맨 위 왼쪽의 학교 로고와 서비스 이름
export default function AdminBrand() {
  return (
    <div className='flex h-[6.6rem] items-center gap-[1.2rem]'>
      {/* 로고는 사진이 들어간 그림이라 아이콘이 아닌 이미지로 둔다 */}
      <Image src='/logo-ku.svg' alt='건국대학교' width={90} height={47} priority />
      <p className='title-20-bd whitespace-nowrap text-black'>건국대학교 출근부 시스템</p>
    </div>
  );
}
