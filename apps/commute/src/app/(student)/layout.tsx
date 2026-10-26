import BottomNav from '@/shared/ui/bottom-nav/BottomNav';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className='mx-auto flex min-h-screen max-w-[45rem] justify-center'>
      {children}
      <BottomNav />
    </div>
  );
}
