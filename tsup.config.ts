import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'agents/index': 'src/agents/index.ts',
    'services/index': 'src/services/index.ts',
    'tools/index': 'src/tools/index.ts',
  },
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ['@giulio-leone/ai-config', '@giulio-leone/lib-shared', '@giulio-leone/types'],
});
