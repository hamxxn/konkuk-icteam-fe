'use client';

import { useState } from 'react';

import { cn } from '@konkuk-icteam-fe/design-system/cn';

import { SLOT_STATUS_CLASS_NAME } from '../constants';
import type { SlotCellData } from '../types';

// 명단 툴팁을 커서에서 오른쪽 아래로 얼마나 띄울지(px)
const TOOLTIP_CURSOR_OFFSET = 12;

type TooltipPosition = { x: number; y: number };

type SlotCellProps = {
  cell: SlotCellData;
};

export default function SlotCell({ cell }: SlotCellProps) {
  const hasWorkers = cell.mode === 'detail' && cell.workers.length > 0;
  // 클릭은 edit·apply에서만 된다. 그 안에서 막을 칸은 useTimeTable이 disabled로 정해 준다.
  const isClickable = cell.mode === 'edit' || cell.mode === 'apply';
  // 칸 안에서의 커서 위치. 마우스가 칸 밖으로 나가면 null이라 툴팁을 숨긴다.
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setTooltipPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setTooltipPosition(null);
  };

  return (
    <div
      className='relative w-full'
      onMouseMove={hasWorkers ? handleMouseMove : undefined}
      onMouseLeave={hasWorkers ? handleMouseLeave : undefined}
    >
      <button
        className={cn(
          'flex h-[3.6rem] w-full items-center justify-center rounded-[0.4rem]',
          SLOT_STATUS_CLASS_NAME[cell.status],
          // 막힌 버튼은 마우스 이벤트를 받지 않아서, 명단이 있는 칸은 감싸는 칸이 커서를 읽게 통과시킨다
          hasWorkers && 'pointer-events-none',
        )}
        disabled={isClickable ? cell.disabled : true}
        onClick={isClickable ? cell.onClick : undefined}
        type='button'
      >
        {cell.mode === 'detail' && (
          <span
            className={cn(
              'caption-12-rg',
              cell.status === 'APPLIED' ? 'text-black-1' : 'text-gray-400',
            )}
          >
            {cell.workers.length}/{cell.maxCount}
          </span>
        )}
      </button>
      {/* 마우스를 올리면 커서 오른쪽 아래에 근무자 명단을 띄우고, 커서를 따라 움직인다 */}
      {hasWorkers && tooltipPosition && (
        <ul
          className='caption-12-rg bg-black-1 pointer-events-none absolute z-10 flex flex-col gap-[0.2rem] rounded-[0.4rem] border border-black px-[0.8rem] py-[0.6rem] whitespace-nowrap text-black'
          style={{
            left: tooltipPosition.x + TOOLTIP_CURSOR_OFFSET,
            top: tooltipPosition.y + TOOLTIP_CURSOR_OFFSET,
          }}
        >
          {cell.workers.map((worker) => (
            <li key={worker}>{worker}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
