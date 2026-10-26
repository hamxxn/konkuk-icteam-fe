import PageClient from './page.client';
import { parseStudentTab } from './_utils/studentTab';

// 보는 탭은 주소(?tab=)에 둔다. 새로 고치거나 주소를 나눠도 같은 탭이 열린다
export default async function StudentsPage({ searchParams }: PageProps<'/students'>) {
  const { tab } = await searchParams;

  return <PageClient tab={parseStudentTab(tab)} />;
}
