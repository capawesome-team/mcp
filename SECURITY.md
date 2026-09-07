# Security Policy

## Reporting a vulnerability

Please report security vulnerabilities to [security@capawesome.io](mailto:security@capawesome.io). Do not open a public issue.

We will acknowledge your report and keep you updated until the issue is resolved.

## Scope

This package is a thin proxy that forwards MCP requests from your client to `https://mcp.capawesome.io/mcp` over HTTPS.

The only credential it handles is the optional `CAPAWESOME_TOKEN` environment variable. When set, it is sent as an `Authorization: Bearer` header to `https://mcp.capawesome.io/mcp` and nowhere else. It is never written to disk, never logged and never included in error output. Without it, only the public documentation tools are available.

If you set `CAPAWESOME_MCP_URL` to a different endpoint, the token is sent to that endpoint instead. Only point it at a host you trust.
