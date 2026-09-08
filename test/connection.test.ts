import { describe, expect, it } from 'vitest';
import { resolveConnection } from '../src/connection.js';

describe('resolveConnection', () => {
  it('defaults to the hosted MCP server', () => {
    expect(resolveConnection({}).url).toBe('https://mcp.capawesome.io/mcp');
  });

  it('uses CAPAWESOME_MCP_URL when set', () => {
    expect(
      resolveConnection({ CAPAWESOME_MCP_URL: 'http://127.0.0.1:3000/mcp' })
        .url,
    ).toBe('http://127.0.0.1:3000/mcp');
  });

  it('falls back to the default URL when CAPAWESOME_MCP_URL is empty', () => {
    expect(resolveConnection({ CAPAWESOME_MCP_URL: '' }).url).toBe(
      'https://mcp.capawesome.io/mcp',
    );
  });

  it('rejects a malformed CAPAWESOME_MCP_URL with a readable message', () => {
    expect(() =>
      resolveConnection({ CAPAWESOME_MCP_URL: 'not a url' }),
    ).toThrow('Invalid MCP server URL "not a url".');
  });

  it('passes the toolsets on as a query parameter', () => {
    expect(
      resolveConnection({ CAPAWESOME_MCP_TOOLSETS: 'docs,cloud-apps' }).url,
    ).toBe('https://mcp.capawesome.io/mcp?toolsets=docs%2Ccloud-apps');
  });

  it('requests read-only mode only for the exact value "true"', () => {
    expect(resolveConnection({ CAPAWESOME_MCP_READONLY: 'true' }).url).toBe(
      'https://mcp.capawesome.io/mcp?readonly=true',
    );
    expect(resolveConnection({ CAPAWESOME_MCP_READONLY: '1' }).url).toBe(
      'https://mcp.capawesome.io/mcp',
    );
  });

  it('identifies the package via the User-Agent header', () => {
    expect(resolveConnection({}).headers['User-Agent']).toMatch(
      /^@capawesome\/mcp\/\d+\.\d+\.\d+/,
    );
  });

  it('sends the token as a bearer token', () => {
    expect(
      resolveConnection({ CAPAWESOME_TOKEN: 'test-token' }).headers
        .Authorization,
    ).toBe('Bearer test-token');
  });

  it('sends no Authorization header without a token', () => {
    expect(Object.keys(resolveConnection({}).headers)).toEqual(['User-Agent']);
    expect(
      Object.keys(resolveConnection({ CAPAWESOME_TOKEN: '' }).headers),
    ).toEqual(['User-Agent']);
  });
});
