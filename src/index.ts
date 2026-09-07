#!/usr/bin/env node
import {
  Client,
  StreamableHTTPClientTransport,
} from '@modelcontextprotocol/client';
import { Server } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { resolveConnection } from './connection.js';
import { PACKAGE_INFO } from './package-info.js';

/** The only capability the remote server exposes. */
const PROXIED_METHODS = ['tools/list', 'tools/call'] as const;

async function connectToRemoteServer(): Promise<Client> {
  const { headers, url } = resolveConnection();
  const client = new Client(PACKAGE_INFO);
  try {
    await client.connect(
      new StreamableHTTPClientTransport(new URL(url), {
        requestInit: { headers },
      }),
    );
  } catch {
    process.stderr.write(`Failed to connect to the MCP server at ${url}.\n`);
    process.exit(1);
  }
  return client;
}

function createProxyServer(remoteServer: Client): Server {
  const server = new Server(remoteServer.getServerVersion() ?? PACKAGE_INFO, {
    capabilities: { tools: {} },
    instructions: remoteServer.getInstructions(),
  });
  for (const method of PROXIED_METHODS) {
    server.setRequestHandler(method, request =>
      remoteServer.request({ method, params: request.params }),
    );
  }
  return server;
}

const remoteServer = await connectToRemoteServer();
serveStdio(() => createProxyServer(remoteServer));
