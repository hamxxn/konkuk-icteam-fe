import { cn } from '@konkuk-icteam-fe/design-system/cn';

import { SLOT_STATUS_CLASS_NAME } from './timetable/constants';
import type { SlotLegendItem } from '../_constants/slotLegend';

type SlotLegendProps = {
  items: SlotLegendItem[];
};

// 칸 색이 무슨 뜻인지 알려 주는 범례. 표 칸과 같은 색을 작은 칸 모양으로 보여 준다.
export default function SlotLegend({ items }: SlotLegendProps) {
  return (
    <ul
      className='grid border-t border-gray-400/20 pt-[1rem]'
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map(({ status, label }) => (
        <li
          key={status}
          className='caption-11-md flex items-center justify-center gap-[0.5rem] text-gray-500'
        >
          {/* 작은 칸에서는 표의 두꺼운 테두리가 무거워 보여서 얇게 덮어쓴다 */}
          <span
            aria-hidden
            className={cn(
              'h-[1rem] w-[1.6rem] shrink-0 rounded-[0.3rem]',
              SLOT_STATUS_CLASS_NAME[status],
              'border-[1.5px]',
            )}
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
