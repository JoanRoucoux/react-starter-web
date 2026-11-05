import { rmSync } from 'node:fs';
import { defineConfig } from 'orval';

const target = './src/app/core/api-client';

export default defineConfig({
  api: {
    input: './openapi/openapi.yaml',
    output: {
      mode: 'tags-split',
      target,
      client: 'react-query',
      httpClient: 'fetch',
      formatter: 'prettier',
      override: {
        mutator: {
          path: './src/app/core/http/api-fetch.ts',
          name: 'apiFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: () => rmSync(`${target}/index.ts`, { force: true }),
    },
  },
});
