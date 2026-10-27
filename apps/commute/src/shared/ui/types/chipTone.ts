import type { ComponentProps } from 'react';
import type { StateChip } from '@konkuk-icteam-fe/design-system/ui';

// 디자인 시스템 칩이 지원하는 색 (StateChip/TagChip 공통)
export type ChipTone = NonNullable<ComponentProps<typeof StateChip>['tone']>;
