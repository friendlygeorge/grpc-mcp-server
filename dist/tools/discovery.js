/**
 * Tool: list_services
 *
 * List all discovered gRPC services on the connected endpoint.
 */
export function registerDiscoveryTools(server, ctx) {
    server.tool("list_services", "List all gRPC services discovered via server reflection on the connected endpoint", {}, async () => {
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
        const services = ctx.getServices();
        if (services.size === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Connected to ${ctx.getEndpoint()} but no services discovered via reflection.`,
                    },
                ],
            };
        }
        const serviceList = Array.from(services.values())
            .map((s) => `• **${s.name}** (${s.fullName})\n  Methods: ${s.methods.map((m) => `${m.name} (${m.type})`).join(", ")}`)
            .join("\n\n");
        return {
            content: [
                {
                    type: "text",
                    text: `Services on ${ctx.getEndpoint()}:\n\n${serviceList}`,
                },
            ],
        };
    });
    server.tool("list_methods", "List all methods for a specific gRPC service", {
        service_name: z.string().describe("Full service name (e.g. grpc.health.v1.Health)"),
    }, async ({ service_name }) => {
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
        const methodList = service.methods
            .map((m) => `• **${m.name}** (${m.type})\n  Request: ${m.requestType}\n  Response: ${m.responseType}`)
            .join("\n\n");
        return {
            content: [
                {
                    type: "text",
                    text: `Methods for ${service.name}:\n\n${methodList}`,
                },
            ],
        };
    });
}
// Need z for list_methods parameter
import { z } from "zod";
//# sourceMappingURL=discovery.js.map