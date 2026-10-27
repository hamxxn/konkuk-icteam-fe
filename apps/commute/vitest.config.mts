import path from 'node:path';
import { defineConfig } from 'vitest/config';

// 순수 로직 테스트만 돌린다. 앱과 같은 '@/' 경로를 쓴다
export default defineConfig({
  resolve: {
    alias: { '@': path.join(import.meta.dirname, 'src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
