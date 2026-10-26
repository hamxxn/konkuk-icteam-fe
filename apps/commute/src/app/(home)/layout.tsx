import { MobileFrame } from '@/shared/ui';

export default function HomeLayout({ children }: LayoutProps<'/'>) {
  return <MobileFrame>{children}</MobileFrame>;
}
