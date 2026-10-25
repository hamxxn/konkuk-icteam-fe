import Link from 'next/link';
import { Tabs } from '@konkuk-icteam-fe/design-system/ui';
import { ROUTES } from '@/shared/config/routes';
import type { WorkChangeRequestSummary } from '../../../_apis/workChangeRequests';
import type { StatusFilter } from '../_lib/statusFilter';

// 탭마다 보여 줄 건수는 응답 summary의 어느 값인지
const STATUS_FILTERS: {
  value: StatusFilter;
  label: string;
  countKey: keyof WorkChangeRequestSummary;
}[] = [
  { value: 'ALL', label: '전체', countKey: 'totalCount' },
  { value: 'CS01', label: '승인 대기', countKey: 'pendingCount' },
  { value: 'CS02', label: '승인', countKey: 'approvedCount' },
  { value: 'CS03', label: '반려', countKey: 'rejectedCount' },
];

type StatusFilterTabsProps = {
  summary: WorkChangeRequestSummary;
  selected: StatusFilter;
};

// 처리 상태별 건수 탭. 누르면 주소가 바뀌고 그 상태의 요청만 보여 준다
export default function StatusFilterTabs({ summary, selected }: StatusFilterTabsProps) {
  return (
    <Tabs>
      <Tabs.List activeValue={selected} tabs={STATUS_FILTERS} aria-label='처리 상태'>
        {STATUS_FILTERS.map(({ value, label, countKey }) => (
          <Tabs.Item
            key={value}
            as={Link}
            value={value}
            activeValue={selected}
            href={`${ROUTES.ADMIN_WORKTIME_CHANGE_REQUESTS}?status=${value}`}
            scroll={false}
          >
            {summary[countKey] > 0 ? `${label} (${summary[countKey]})` : label}
          </Tabs.Item>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
