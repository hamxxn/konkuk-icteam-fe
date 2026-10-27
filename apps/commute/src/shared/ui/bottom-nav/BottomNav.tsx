'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IconHome, IconHomeFill, IconWorktime } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { ROUTES } from '@/shared/config/routes';

const NAV_ITEMS = [
  { href: ROUTES.HOME, label: '홈', Icon: IconHome, ActiveIcon: IconHomeFill },
  { href: ROUTES.TIMETABLE, label: '시간표', Icon: IconWorktime, ActiveIcon: IconWorktime },
] as const;

// 탭 한 칸의 너비와 칸 사이 간격. 알약을 옮길 거리 계산에 같이 쓴다.
const TAB_WIDTH_REM = 7.2;
const TAB_GAP_REM = 0.4;

// 내비게이션이 보이는 주소. 수정·신청 같은 하위 화면은 하단 버튼이 있어서 숨긴다.
const checkTabPath = (pathname: string) => NAV_ITEMS.some(({ href }) => href === pathname);

// 루트 레이아웃에 한 번만 두는 하단 탭. 화면을 옮겨도 새로 그려지지 않아서 알약이 탭 사이를 미끄러진다.
// 화면 아래 가운데에 떠 있는 유리 막대에 아이콘만 보여 주고, 지금 탭은 유리 알약 위 채운 파란 아이콘으로 구분한다.
export default function BottomNav() {
  const pathname = usePathname();

  if (!checkTabPath(pathname)) return null;

  const activeIndex = NAV_ITEMS.findIndex(({ href }) => href === pathname);

  return (
    // 바깥은 화면 폭(45rem) 안 가운데 자리만 잡고, 클릭은 안쪽 막대에서만 받는다
    <div className='animate-nav-rise pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[45rem] justify-center pb-[calc(1.6rem+env(safe-area-inset-bottom))] motion-reduce:animate-none'>
      {/* 유리 질감은 globals.css의 glass 유틸리티(흐림·빛 받은 테두리·반사광·그림자) */}
      <nav className='glass glass-clear pointer-events-auto rounded-full p-[0.6rem] ring-1 ring-gray-400/20'>
        {/* 지금 탭 뒤의 유리 알약. 하나만 두고 탭이 바뀌면 그 자리로 탄성 있게 미끄러진다 */}
        <span
          aria-hidden
          className='bg-blue/10 absolute top-[0.6rem] left-[0.6rem] h-[4.8rem] rounded-full shadow-[inset_0_0.1rem_0.1rem_rgb(255_255_255_/_0.6)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none'
          style={{
            width: `${TAB_WIDTH_REM}rem`,
            transform: `translateX(${activeIndex * (TAB_WIDTH_REM + TAB_GAP_REM)}rem)`,
          }}
        />
        <ul className='relative flex items-center' style={{ gap: `${TAB_GAP_REM}rem` }}>
          {NAV_ITEMS.map(({ href, label, Icon, ActiveIcon }, index) => {
            const isActive = index === activeIndex;
            const NavIcon = isActive ? ActiveIcon : Icon;

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex h-[4.8rem] items-center justify-center rounded-full transition-colors duration-300',
                    isActive ? 'text-blue' : 'text-gray-500 hover:text-gray-700',
                  )}
                  style={{ width: `${TAB_WIDTH_REM}rem` }}
                >
                  {/* 지금 탭 아이콘은 살짝 커지고, 누르는 순간에는 눌린 듯 작아진다 */}
                  <NavIcon
                    aria-hidden
                    className={cn(
                      'h-[2.6rem] w-[2.6rem] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 motion-reduce:transition-none',
                      isActive && 'scale-110',
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
