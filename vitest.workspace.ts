import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './vitest.config.ts',
  './packages/core/vitest.config.ts',
  './packages/vue/vitest.config.ts',
  './packages/react/vitest.config.ts',
]);
