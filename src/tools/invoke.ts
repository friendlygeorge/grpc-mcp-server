/**
 * Tool: invoke_rpc
 *
 * Call a gRPC method with a JSON-serialized request.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ServerContext } from "../context.js";
import { invokeMethod } from "../invoke.js";

export function registerInvokeTools(
  server: McpServer,
  ctx: ServerContext
): void {
  server.tool(
    "invoke_rpc",
    "Invoke a gRPC method with a JSON-serialized request body",
    {
      service_name: z
        .string()
        .describe("Full service name (e.g. grpc.health.v1.Health)"),
      method_name: z.string().describe("Method name (e.g. Check)"),
      request: z
        .record(z.unknown())
        .describe("JSON-serialized request body as a key-value object matching the method's input schema"),
      timeout_ms: z
        .number()
        .optional()
        .describe("Call timeout in ms (default: 10000)"),
      metadata: z
        .record(z.string())
        .optional()
        .describe("Optional gRPC metadata as key-value pairs"),
    },
    async ({ service_name, method_name, request, timeout_ms, metadata }) => {
      if (!ctx.isConfigured()) {
        return {
          content: [
            {
              type: "text",
              text: "Not connected to a gRPC endpoint. Use connect_endpoint first.",
            },
          ],
        };
      }

      const channel = ctx.getChannel();
      if (!channel) {
        return {
          content: [
            { type: "text", text: "gRPC channel is not available." },
          ],
        };
      }

      const result = await invokeMethod(channel, service_name, method_name, request, {
        timeoutMs: timeout_ms ?? ctx.getTimeoutMs(),
        metadata,
      });

      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `RPC call ${service_name}/${method_name} succeeded:\n\n\`\`\`json\n${JSON.stringify(result.data, null, 2)}\n\`\`\``,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `RPC call ${service_name}/${method_name} failed:\n${result.error}`,
            },
          ],
        };
      }
    }
  );
}
