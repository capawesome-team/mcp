# Capawesome MCP Server

The official MCP server for [Capawesome](https://capawesome.io). It gives AI assistants the current Capawesome documentation — plugins, Capawesome Cloud, Capawesome Insiders and the CLI — and, with an API token, the Capawesome Cloud management API for apps, channels, builds, deployments and more.

Maintained by [Capawesome](https://capawesome.io).

## Endpoint

The server is hosted and ready to use:

```
https://mcp.capawesome.io/mcp
```

The documentation tools need no account and no token. The Capawesome Cloud tools are only available when the request carries an API token — see [Authentication](#authentication).

## Installation

### Claude Code

```bash
claude mcp add --transport http capawesome "https://mcp.capawesome.io/mcp?toolsets=all" \
  --header "Authorization: Bearer YOUR_TOKEN"
```

### Claude Desktop / Claude.ai

Go to **Settings → Connectors → Add custom connector** and enter:

- **Name**: `Capawesome`
- **URL**: `https://mcp.capawesome.io/mcp`

### Cursor

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=capawesome&config=eyJ0eXBlIjoiaHR0cCIsInVybCI6Imh0dHBzOi8vbWNwLmNhcGF3ZXNvbWUuaW8vbWNwIn0=)

Or add `.cursor/mcp.json` to your project:

```json
{
  "mcpServers": {
    "capawesome": {
      "url": "https://mcp.capawesome.io/mcp"
    }
  }
}
```

### VS Code

[Install in VS Code](https://insiders.vscode.dev/redirect/mcp/install?name=capawesome&config=%7B%22name%22%3A%22capawesome%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.capawesome.io%2Fmcp%22%7D)

Or add `.vscode/mcp.json` to your project:

```json
{
  "servers": {
    "capawesome": {
      "type": "http",
      "url": "https://mcp.capawesome.io/mcp"
    }
  }
}
```

### Windsurf

Add the server to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "capawesome": {
      "serverUrl": "https://mcp.capawesome.io/mcp"
    }
  }
}
```

### Zed

Add the server to your Zed `settings.json`:

```json
{
  "context_servers": {
    "capawesome": {
      "url": "https://mcp.capawesome.io/mcp"
    }
  }
}
```

### Any client via npx

Clients that cannot connect to a remote server over HTTP can run this package, which proxies stdio to the hosted server:

```json
{
  "mcpServers": {
    "capawesome": {
      "command": "npx",
      "args": ["-y", "@capawesome/mcp"],
      "env": {
        "CAPAWESOME_TOKEN": "your-token"
      }
    }
  }
}
```

Requires Node.js 22 or later. Omit `env` to use the documentation tools only.

## Authentication

Create an API token in the [Capawesome Cloud Console](https://console.cloud.capawesome.io/settings/tokens) and pass it to the server.

When connecting over HTTP, send it as an `Authorization: Bearer <token>` header. When running this package, set the `CAPAWESOME_TOKEN` environment variable and the proxy sends the header for you.

Without a token, only the documentation tools are registered — the Capawesome Cloud tools are absent, not merely hidden.

## Configuration

These environment variables configure the proxy. They apply to this package only; over HTTP, use the equivalent header and query parameters.

| Variable                  | Purpose                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CAPAWESOME_TOKEN`        | API token, sent as `Authorization: Bearer`. Optional; without it only the documentation tools are available.                                            |
| `CAPAWESOME_MCP_TOOLSETS` | Comma-separated toolsets to register, sent as `?toolsets=`. Use `cloud` for every Capawesome Cloud toolset or `all` for everything. Defaults to `docs`. |
| `CAPAWESOME_MCP_READONLY` | Set to `true` to skip every tool that writes or deletes, sent as `?readonly=true`.                                                                      |
| `CAPAWESOME_MCP_URL`      | Override the endpoint. For development only.                                                                                                            |

## Tools

The server exposes the documentation tools (`search_docs`, `get_doc_page`, `list_blog_posts`) plus the `cloud_*` tools for the Capawesome Cloud management API, grouped into toolsets.

See the [MCP documentation](https://capawesome.io/docs/ai/mcp/) for the full tool and toolset reference.

## Rate limits

The endpoint is limited to **100 requests per minute per IP**. Requests over the limit are answered with `429 Too Many Requests`; retry after a short wait.

## Privacy

Your IP address is processed for rate limiting only. Queries and tool arguments are not stored, not logged beyond Cloudflare's standard edge logs, and never used for training. Your API token is used to authenticate against the Capawesome Cloud API on your behalf and is not stored by the server. See the [Privacy Policy](https://capawesome.io/legal/privacy-policy/) for details.

## Related

- [Capacitor MCP Server](https://github.com/capawesome-team/capacitor-mcp) — unofficial MCP server for the Capacitor documentation, plugin list and blog.
- [Ionic Framework MCP Server](https://github.com/capawesome-team/ionic-framework-mcp) — unofficial MCP server for the Ionic Framework documentation, components and usage examples.
- [Capawesome Cloud Live Updates](https://capawesome.io/cloud/live-updates/) — ship JavaScript, HTML and CSS changes to your app without an app store review.
- [Capawesome Cloud Native Builds](https://capawesome.io/cloud/native-builds/) — build native iOS and Android apps in the cloud, without a Mac.
- [Capawesome Cloud App Store Publishing](https://capawesome.io/cloud/app-store-publishing/) — submit builds to the Apple App Store and Google Play Store.

## Development

```bash
npm install
npm run build
npm test
```

Set `CAPAWESOME_MCP_URL` to point the proxy at a local server instead of the hosted one:

```bash
CAPAWESOME_MCP_URL=http://localhost:8787/mcp node dist/index.js
```

## Release

Releases are managed by [release-please](https://github.com/googleapis/release-please). Merging its release pull request tags the version, publishes the package to npm and then publishes `server.json` to the [MCP Registry](https://registry.modelcontextprotocol.io). The version in `server.json` is bumped by release-please together with `package.json`, so it never has to be edited by hand. To publish to the registry manually, install [`mcp-publisher`](https://github.com/modelcontextprotocol/registry), run `mcp-publisher login dns --domain=capawesome.io --private-key=<key>` with the Ed25519 private key from the password manager and then `mcp-publisher publish`.

## License

See [LICENSE](LICENSE).
