'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { ADMIN_NAVIGATION_ITEMS } from '../_constants/navigation';
import { checkActiveNavigation } from '../_lib/checkActiveNavigation';

// 관리자 메뉴.
export default function AdminNav() {
  const pathname = usePathname();
  const activeIndex = ADMIN_NAVIGATION_ITEMS.findIndex(({ href }) =>
    checkActiveNavigation(pathname, href),
  );

  return (
    // 바깥은 화면 왼쪽 세로 가운데 자리만 잡고, 클릭은 안쪽 막대에서만 받는다
    <div className='pointer-events-none fixed inset-y-0 left-[2.4rem] z-40 flex items-center'>
      <nav
        aria-label='관리자 메뉴'
        className='glass glass-clear animate-nav-rise pointer-events-auto rounded-[3rem] p-[0.6rem] ring-1 ring-gray-400/20 motion-reduce:animate-none'
      >
        {/* 지금 메뉴 뒤의 유리 알약. 하나만 두고 메뉴가 바뀌면 그 자리로 탄성 있게 미끄러진다 */}
        {activeIndex >= 0 ? (
          <span
            aria-hidden
            className='bg-blue/10 absolute inset-x-[0.6rem] top-[0.6rem] h-[4.8rem] rounded-full shadow-[inset_0_0.1rem_0.1rem_rgb(255_255_255_/_0.6)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none'
            // 한 칸 = 메뉴 높이 4.8rem + 간격 0.4rem
            style={{ transform: `translateY(${activeIndex * 5.2}rem)` }}
          />
        ) : null}
        <ul className='relative flex flex-col gap-[0.4rem]'>
          {ADMIN_NAVIGATION_ITEMS.map(({ label, href, icon, activeIcon }, index) => {
            const isActive = index === activeIndex;
            const NavigationIcon = isActive ? activeIcon : icon;

            return (
              <li key={href}>
                {/* 글자 없이 아이콘만 두므로, 메뉴 이름은 스크린리더용 이름과 마우스를 올렸을 때 뜨는 말풍선으로 준다 */}
                <Link
                  href={href}
                  aria-label={label}
                  title={label}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex h-[4.8rem] w-[7.2rem] items-center justify-center rounded-full transition-colors duration-300',
                    isActive ? 'text-blue' : 'text-gray-500 hover:text-gray-700',
                  )}
                >
                  {/* 지금 메뉴 아이콘은 살짝 커지고, 누르는 순간에는 눌린 듯 작아진다 */}
                  <NavigationIcon
                    aria-hidden
                    className={cn(
                      'h-[2.6rem] w-[2.6rem] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 motion-reduce:transition-none',
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
