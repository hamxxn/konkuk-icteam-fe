import AdminBrand from './_components/AdminBrand';
import AdminNav from './_components/AdminNav';

// 왼쪽에 떠 있는 메뉴 막대 너비(7.2rem 칸 + 안쪽 여백 1.2rem)와 화면 왼쪽 여백(2.4rem)을 비워 둔다
const NAV_SPACE_CLASS_NAME = 'pl-[12rem]';

// 데스크톱 전용: 좁은 창에서는 가로로 스크롤된다
export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <div className='bg-black-1 min-h-screen w-full'>
      <AdminNav />

      <div
        className={`flex min-h-screen min-w-[128rem] flex-col pt-[2.4rem] pr-[2.4rem] ${NAV_SPACE_CLASS_NAME}`}
      >
        <AdminBrand />
        <main className='flex-1'>{children}</main>
      </div>
    </div>
  );
}
