/**
 * MCP server factory for gRPC.
 *
 * Creates the McpServer instance, sets up shared context, and registers
 * all tool categories.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ServerContext, type ServerContextOptions } from "./context.js";
export interface ServerOptions extends ServerContextOptions {
}
export declare function createServer(options?: ServerOptions): {
    server: McpServer;
    ctx: ServerContext;
};
//# sourceMappingURL=server.d.ts.map