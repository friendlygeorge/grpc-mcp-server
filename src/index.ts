#!/usr/bin/env node
/**
 * Entry point for the gRPC MCP server.
 *
 * Starts an MCP server over stdio. The agent connects via stdio, then
 * calls `connect_endpoint` (or relies on the GRPC_ENDPOINT env var) to
 * point the server at a gRPC backend.
 *
 * Environment variables:
 *   GRPC_ENDPOINT        Target endpoint (e.g. localhost:50051)
 *   GRPC_SERVICE_CONFIG  Optional service config JSON
 *   GRPC_TIMEOUT_MS      Request timeout in ms (optional, default 10000)
 *   GRPC_USE_TLS         Set to "true" for TLS connections
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main() {
  const { server, ctx } = createServer();

  if (ctx.isConfigured()) {
    process.stderr.write(
      `gRPC MCP server ready — endpoint: ${ctx.getEndpoint()}\n`
    );
  } else {
    process.stderr.write(
      `gRPC MCP server ready — no endpoint configured. Use connect_endpoint or set GRPC_ENDPOINT.\n`
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  const shutdown = () => {
    process.stderr.write("Shutting down gRPC MCP server.\n");
    ctx.disconnect();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  process.stderr.write(
    `Fatal error: ${error instanceof Error ? error.stack : error}\n`
  );
  process.exit(1);
});
