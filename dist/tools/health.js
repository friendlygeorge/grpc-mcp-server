/**
 * Tool: health_check
 *
 * Implements the standard gRPC Health Checking Protocol (v1).
 */
import { z } from "zod";
import { invokeMethod } from "../invoke.js";
export function registerHealthTools(server, ctx) {
    server.tool("health_check", "Check gRPC server health using the standard Health Checking Protocol", {
        service: z
            .string()
            .optional()
            .describe("Service name to check (empty string = overall server health)"),
        timeout_ms: z
            .number()
            .optional()
            .describe("Timeout in ms (default: 5000)"),
    }, async ({ service, timeout_ms }) => {
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
        const serviceName = service ?? "";
        const request = { service: serviceName };
        try {
            const result = await invokeMethod(channel, "grpc.health.v1.Health", "Check", request, { timeoutMs: timeout_ms ?? 5000 });
            if (result.success) {
                const status = result.data?.status ?? "UNKNOWN";
                const statusMap = {
                    "0": "UNKNOWN",
                    "1": "SERVING",
                    "2": "NOT_SERVING",
                    "3": "SERVICE_UNKNOWN",
                };
                const friendlyStatus = statusMap[String(status)] ?? String(status);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Health check for "${serviceName || "(overall)"}": **${friendlyStatus}**`,
                        },
                    ],
                };
            }
            else {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Health check failed: ${result.error}\n\nThe endpoint may not implement the standard gRPC Health Checking Protocol.`,
                        },
                    ],
                };
            }
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Health check error: ${error instanceof Error ? error.message : String(error)}\n\nThe endpoint may not implement the standard gRPC Health Checking Protocol.`,
                    },
                ],
            };
        }
    });
}
//# sourceMappingURL=health.js.map