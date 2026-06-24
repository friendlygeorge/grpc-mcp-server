/**
 * Tool: connect_endpoint
 *
 * Connect to a gRPC server and discover available services via server reflection.
 * If no endpoint is provided, uses GRPC_ENDPOINT env var.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ServerContext } from "../context.js";
import { reflectServices } from "../reflection.js";

export function registerConnectTools(
  server: McpServer,
  ctx: ServerContext
): void {
  server.tool(
    "connect_endpoint",
    "Connect to a gRPC server endpoint and discover available services via server reflection",
    {
      endpoint: z
        .string()
        .describe("gRPC endpoint address (e.g. localhost:50051)"),
      use_tls: z
        .boolean()
        .optional()
        .describe("Whether to use TLS (default: false)"),
      timeout_ms: z
        .number()
        .optional()
        .describe("Connection timeout in ms (default: 10000)"),
    },
    async ({ endpoint, use_tls, timeout_ms }) => {
      try {
        ctx.configure({
          endpoint,
          useTls: use_tls ?? false,
          timeoutMs: timeout_ms ?? 10000,
        });

        const channel = ctx.getChannel();
        if (!channel) {
          return {
            content: [
              { type: "text", text: "Failed to create gRPC channel" },
            ],
          };
        }

        // Run reflection to discover services
        const services = await reflectServices(channel, timeout_ms ?? 10000);
        ctx.setServices(services);

        const serviceList = Array.from(services.values())
          .map(
            (s) =>
              `• **${s.name}** — ${s.methods.length} method(s): ${s.methods.map((m) => m.name).join(", ")}`
          )
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text:
                services.size > 0
                  ? `Connected to gRPC endpoint: ${endpoint}\n\nDiscovered ${services.size} service(s):\n${serviceList}`
                  : `Connected to gRPC endpoint: ${endpoint}\n\nNo services discovered via reflection. The endpoint may not support gRPC server reflection.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to connect: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "disconnect",
    "Disconnect from the current gRPC endpoint and clear cached service data",
    {},
    async () => {
      ctx.disconnect();
      return {
        content: [
          { type: "text", text: "Disconnected from gRPC endpoint." },
        ],
      };
    }
  );
}
