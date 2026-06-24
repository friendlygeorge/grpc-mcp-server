/**
 * gRPC server reflection client.
 *
 * Uses the standard gRPC server reflection protocol (v1) to discover
 * services, methods, and type information from a running gRPC endpoint.
 */
import * as grpc from "@grpc/grpc-js";
import type { ServiceInfo } from "./context.js";
/**
 * Query the server reflection API and return all services/methods.
 */
export declare function reflectServices(channel: grpc.Channel, timeoutMs?: number): Promise<Map<string, ServiceInfo>>;
//# sourceMappingURL=reflection.d.ts.map