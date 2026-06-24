/**
 * gRPC invocation engine.
 *
 * Handles calling gRPC methods using the low-level channel API.
 */
import * as grpc from "@grpc/grpc-js";
export interface InvokeResult {
    success: boolean;
    data?: any;
    error?: string;
}
/**
 * Invoke a gRPC unary method on a channel.
 */
export declare function invokeMethod(channel: grpc.Channel, serviceName: string, methodName: string, request: any, options?: {
    timeoutMs?: number;
    metadata?: Record<string, string>;
}): Promise<InvokeResult>;
//# sourceMappingURL=invoke.d.ts.map