/**
 * MCP server factory for gRPC.
 *
 * Creates the McpServer instance, sets up shared context, and registers
 * all tool categories.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ServerContext, configFromEnv, type ServerContextOptions } from "./context.js";
import { registerConnectTools } from "./tools/connect.js";
import { registerDiscoveryTools } from "./tools/discovery.js";
import { registerInvokeTools } from "./tools/invoke.js";
import { registerHealthTools } from "./tools/health.js";
import { registerDescriptorTools } from "./tools/descriptor.js";

export interface ServerOptions extends ServerContextOptions {}

export function createServer(options?: ServerOptions): {
  server: McpServer;
  ctx: ServerContext;
} {
  const ctx = new ServerContext();

  const envConfig = configFromEnv();
  const merged: ServerContextOptions = {
    endpoint: options?.endpoint ?? envConfig.endpoint,
    timeoutMs: options?.timeoutMs ?? envConfig.timeoutMs,
    useTls: options?.useTls ?? envConfig.useTls,
  };

  if (merged.endpoint) {
    try {
      ctx.configure(merged);
    } catch (error) {
      process.stderr.write(
        `Warning: failed to configure endpoint at startup: ${error}\n`
      );
    }
  }

  const server = new McpServer({
    name: "grpc-mcp-server",
    version: "0.1.0",
  });

  registerConnectTools(server, ctx);
  registerDiscoveryTools(server, ctx);
  registerDescriptorTools(server, ctx);
  registerInvokeTools(server, ctx);
  registerHealthTools(server, ctx);

  return { server, ctx };
}
