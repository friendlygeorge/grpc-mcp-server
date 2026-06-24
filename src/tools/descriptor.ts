/**
 * Tool: get_service_descriptor
 *
 * Get full service descriptor including methods, options, and metadata.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ServerContext } from "../context.js";

export function registerDescriptorTools(
  server: McpServer,
  ctx: ServerContext
): void {
  server.tool(
    "get_service_descriptor",
    "Get the full descriptor for a gRPC service including all methods, request/response types, and streaming modes",
    {
      service_name: z
        .string()
        .describe("Full service name (e.g. grpc.health.v1.Health)"),
    },
    async ({ service_name }) => {
      if (!ctx.isConfigured()) {
        return {
          content: [
            {
              type: "text",
              text: "Not connected. Use connect_endpoint first.",
            },
          ],
        };
      }

      const service = ctx.getService(service_name);
      if (!service) {
        const available = Array.from(ctx.getServices().keys()).join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Service "${service_name}" not found.\nAvailable services: ${available || "(none)"}`,
            },
          ],
        };
      }

      const descriptor = {
        name: service.name,
        fullName: service.fullName,
        methods: service.methods.map((m) => ({
          name: m.name,
          fullName: m.fullName,
          type: m.type,
          inputType: m.requestType,
          outputType: m.responseType,
        })),
        methodCount: service.methods.length,
      };

      return {
        content: [
          {
            type: "text",
            text: `Service descriptor for ${service.name}:\n\n\`\`\`json\n${JSON.stringify(descriptor, null, 2)}\n\`\`\``,
          },
        ],
      };
    }
  );
}
