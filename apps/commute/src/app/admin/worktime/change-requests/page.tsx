import PageClient from './page.client';
import { parseStatusFilter } from './_lib/statusFilter';

// 보는 처리 상태는 주소(?status=)에 둔다. 새로 고치거나 주소를 나눠도 같은 탭이 열린다
export default async function WorktimeChangeRequestsPage({
  searchParams,
}: PageProps<'/admin/worktime/change-requests'>) {
  const { status } = await searchParams;

  return <PageClient statusFilter={parseStatusFilter(status)} />;
}
