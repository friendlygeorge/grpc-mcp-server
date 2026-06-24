/**
 * Tool: connect_endpoint
 *
 * Connect to a gRPC server and discover available services via server reflection.
 * If no endpoint is provided, uses GRPC_ENDPOINT env var.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ServerContext } from "../context.js";
export declare function registerConnectTools(server: McpServer, ctx: ServerContext): void;
//# sourceMappingURL=connect.d.ts.map