import { PACKAGE_INFO } from './package-info.js';

const DEFAULT_URL = 'https://mcp.capawesome.io/mcp';

export interface Connection {
  headers: Record<string, string>;
  url: string;
}

export function resolveConnection(
  env: NodeJS.ProcessEnv = process.env,
): Connection {
  return {
    headers: resolveHeaders(env),
    url: resolveUrl(env),
  };
}

function resolveHeaders(env: NodeJS.ProcessEnv): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': `${PACKAGE_INFO.name}/${PACKAGE_INFO.version}`,
  };
  if (env.CAPAWESOME_TOKEN) {
    headers.Authorization = `Bearer ${env.CAPAWESOME_TOKEN}`;
  }
  return headers;
}

function resolveUrl(env: NodeJS.ProcessEnv): string {
  const url = parseUrl(env.CAPAWESOME_MCP_URL || DEFAULT_URL);
  if (env.CAPAWESOME_MCP_TOOLSETS) {
    url.searchParams.set('toolsets', env.CAPAWESOME_MCP_TOOLSETS);
  }
  if (env.CAPAWESOME_MCP_READONLY === 'true') {
    url.searchParams.set('readonly', 'true');
  }
  return url.toString();
}

function parseUrl(value: string): URL {
  try {
    return new URL(value);
  } catch {
    throw new Error(`Invalid MCP server URL "${value}".`);
  }
}
