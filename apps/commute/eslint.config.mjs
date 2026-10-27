import nextConfig from '@konkuk-icteam-fe/eslint-config/next';

// 관리자 화면은 아직 목업·디자인 시스템으로 옮기지 않아 빌드와 린트에서 잠시 뺀다 (tsconfig exclude와 같은 목록)
const PARKED_ADMIN_FILES = [
  'src/app/_admin/**',
  'src/features/admin/**',
  'src/screens/admin/**',
  'src/utils/todos.ts',
];

const eslintConfig = [...nextConfig, { ignores: PARKED_ADMIN_FILES }];

export default eslintConfig;
