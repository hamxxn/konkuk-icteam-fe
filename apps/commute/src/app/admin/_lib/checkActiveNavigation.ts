import { isPathActive } from '@/shared/lib/routeMatch';
import { ADMIN_NAVIGATION_ITEMS } from '../_constants/navigation';
import { ROUTES } from '@/shared/config/routes';

const DEFAULT_NAVIGATION_LABEL = '메인 대시보드';

/**
 * 지금 주소가 관리자 메뉴 주소에 속하는지 확인합니다. 대시보드(/admin)는 다른 메뉴의 상위 주소라 정확히 같을 때만 켭니다.
 * @param pathname 지금 주소
 * @param href 메뉴 주소
 * @returns 메뉴가 켜져야 하면 true
 * @example checkActiveNavigation('/admin/worktime/detail', '/admin/worktime'); // true
 */
export const checkActiveNavigation = (pathname: string, href: string) =>
  isPathActive(pathname, href, { exact: href === ROUTES.ADMIN_HOME });

/**
 * 지금 주소에 맞는 관리자 메뉴 이름을 얻습니다. 맞는 메뉴가 없으면 대시보드 이름을 돌려줍니다.
 * @param pathname 지금 주소
 * @returns 헤더에 보여 줄 메뉴 이름
 * @example getActiveNavigationLabel('/admin/students'); // '근로장학생'
 */
export const getActiveNavigationLabel = (pathname: string) =>
  ADMIN_NAVIGATION_ITEMS.find(({ href }) => checkActiveNavigation(pathname, href))?.label ??
  DEFAULT_NAVIGATION_LABEL;
