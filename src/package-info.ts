import { createRequire } from 'node:module';

/**
 * Read at runtime rather than imported, because `package.json` lives outside
 * the TypeScript `rootDir` and must not be copied into `dist`.
 */
export const PACKAGE_INFO = createRequire(import.meta.url)(
  '../package.json',
) as {
  name: string;
  version: string;
};
