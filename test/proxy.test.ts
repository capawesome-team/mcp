import { toNodeHandler } from '@modelcontextprotocol/node';
import { McpServer, createMcpHandler } from '@modelcontextprotocol/server';
import { spawn, type ChildProcess } from 'node:child_process';
import { createServer, type Server as HttpServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createInterface } from 'node:readline';
import { afterAll, beforeAll, expect, it } from 'vitest';

let httpServer: HttpServer;
let proxy: ChildProcess;
let responses: AsyncIterator<string>;

function createFakeRemoteServer(): McpServer {
  const server = new McpServer(
    { name: 'fake-remote', version: '1.0.0' },
    { instructions: 'Fake instructions.' },
  );
  server.registerTool('ping', { description: 'Answers with pong.' }, () => ({
    content: [{ type: 'text', text: 'pong' }],
  }));
  return server;
}

async function send(message: Record<string, unknown>): Promise<void> {
  proxy.stdin!.write(`${JSON.stringify(message)}\n`);
}

async function request(message: Record<string, unknown>): Promise<any> {
  await send(message);
  return JSON.parse((await responses.next()).value);
}

beforeAll(async () => {
  httpServer = createServer(
    toNodeHandler(createMcpHandler(() => createFakeRemoteServer())),
  );
  await new Promise<void>(resolve =>
    httpServer.listen(0, '127.0.0.1', resolve),
  );
  const { port } = httpServer.address() as AddressInfo;
  proxy = spawn(process.execPath, ['dist/index.js'], {
    env: { ...process.env, CAPAWESOME_MCP_URL: `http://127.0.0.1:${port}/mcp` },
    stdio: ['pipe', 'pipe', 'inherit'],
  });
  responses = createInterface({ input: proxy.stdout! })[Symbol.asyncIterator]();
});

afterAll(async () => {
  proxy.kill();
  await new Promise<void>(resolve => httpServer.close(() => resolve()));
});

it('proxies initialize, tools/list and tools/call over stdio', async () => {
  const initialized = await request({
    id: 1,
    jsonrpc: '2.0',
    method: 'initialize',
    params: {
      capabilities: {},
      clientInfo: { name: 'test', version: '1.0.0' },
      protocolVersion: '2025-06-18',
    },
  });
  expect(initialized.result.serverInfo.name).toBe('fake-remote');
  expect(initialized.result.instructions).toBe('Fake instructions.');
  await send({ jsonrpc: '2.0', method: 'notifications/initialized' });

  const listed = await request({
    id: 2,
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
  });
  expect(
    listed.result.tools.map((tool: { name: string }) => tool.name),
  ).toEqual(['ping']);

  const called = await request({
    id: 3,
    jsonrpc: '2.0',
    method: 'tools/call',
    params: { arguments: {}, name: 'ping' },
  });
  expect(called.result.content).toEqual([{ type: 'text', text: 'pong' }]);
});
