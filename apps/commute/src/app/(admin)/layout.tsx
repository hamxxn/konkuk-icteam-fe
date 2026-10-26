import AdminBrand from './_components/AdminBrand';
import AdminNav from './_components/AdminNav';

// 왼쪽에 떠 있는 메뉴 막대 너비(7.2rem 칸 + 안쪽 여백 1.2rem)와 화면 왼쪽 여백(2.4rem)을 비워 둔다
const NAV_SPACE_CLASS_NAME = 'pl-[12rem]';

// 데스크톱 전용: 창이 128rem보다 좁으면 줄어들지 않고 페이지 전체가 가로로 스크롤된다.
// 최소 너비를 바깥 상자에 걸어야 배경도 내용과 같이 넓어진다
export default function AdminLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className='bg-black-1 min-h-screen min-w-[128rem]'>
      <AdminNav />
      <div className={`flex min-h-screen flex-col pt-[2.4rem] pr-[2.4rem] ${NAV_SPACE_CLASS_NAME}`}>
        <AdminBrand />
        <main className='flex-1'>{children}</main>
      </div>
    </div>
  );
}
