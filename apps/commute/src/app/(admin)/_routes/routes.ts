import type { ComponentType, SVGProps } from 'react';
import {
  IconDashboard,
  IconMember,
  IconTask,
  IconWorkRequest,
  IconWorktime,
} from '@konkuk-icteam-fe/design-system/assets';
import { ROUTES } from '@/shared/config/routes';

type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type AdminNavigationItem = {
  label: string;
  href: string;
  icon: NavigationIcon;
  activeIcon: NavigationIcon;
};

// 관리자 사이드바 메뉴. 헤더 제목도 지금 주소에 맞는 메뉴 이름을 쓴다
export const ADMIN_NAVIGATION_ITEMS: AdminNavigationItem[] = [
  {
    label: '메인 대시보드',
    href: ROUTES.ADMIN_HOME,
    icon: IconDashboard,
    activeIcon: IconDashboard,
  },
  {
    label: '근로시간 관리',
    href: ROUTES.ADMIN_WORKTIME,
    icon: IconWorktime,
    activeIcon: IconWorktime,
  },
  {
    label: '근로신청 관리',
    href: ROUTES.ADMIN_WORK_APPLICATIONS,
    icon: IconWorkRequest,
    activeIcon: IconWorkRequest,
  },
  { label: '근로장학생', href: ROUTES.ADMIN_STUDENTS, icon: IconMember, activeIcon: IconMember },
  { label: '업무 관리', href: ROUTES.ADMIN_TASKS, icon: IconTask, activeIcon: IconTask },
];
