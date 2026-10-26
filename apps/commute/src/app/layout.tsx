import type { Metadata } from 'next';
import BottomNav from '@/shared/ui/bottom-nav/BottomNav';
import LiquidGlassFilter from '@/shared/ui/liquid-glass-filter/LiquidGlassFilter';

import './globals.css';

export const metadata: Metadata = {
  title: 'Commute',
  description: '건국대학교 정보운영팀 출근부 서비스',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='ko' className='h-full'>
      <body className='min-h-screen bg-gray-50'>
        {/* 유리(glass) 가장자리 굴절에 쓰는 SVG 필터. 화면에는 보이지 않는다 */}
        <LiquidGlassFilter />
        {children}
        {/* 홈·시간표에서만 보인다. 여기 한 번만 두어야 화면을 옮겨도 남아서 탭 이동 애니메이션이 이어진다 */}
        <BottomNav />
      </body>
    </html>
  );
}
