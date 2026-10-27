import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Commute',
  description: '건국대학교 정보운영팀 출근부 서비스',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='ko' className='h-full'>
      <body className='min-h-screen bg-gray-50'>{children}</body>
    </html>
  );
}
