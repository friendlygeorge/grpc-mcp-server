/**
 * Shared server context for gRPC connections.
 *
 * Holds the active gRPC client channel and reflection data.
 * Configured once (via env or connect_endpoint), then shared by all tools.
 */
import * as grpc from "@grpc/grpc-js";
export interface ServerContextOptions {
    endpoint?: string;
    timeoutMs?: number;
    useTls?: boolean;
}
export declare class ServerContext {
    private endpoint;
    private channel;
    private timeoutMs;
    private useTls;
    /** All discovered service definitions (from reflection). */
    private services;
    configure(opts: ServerContextOptions): void;
    isConfigured(): boolean;
    getEndpoint(): string;
    getChannel(): grpc.Channel | null;
    getTimeoutMs(): number;
    setServices(services: Map<string, ServiceInfo>): void;
    getServices(): Map<string, ServiceInfo>;
    getService(name: string): ServiceInfo | undefined;
    disconnect(): void;
}
export interface ServiceInfo {
    name: string;
    fullName: string;
    methods: MethodInfo[];
}
export interface MethodInfo {
    name: string;
    fullName: string;
    type: "unary" | "server_streaming" | "client_streaming" | "bidi_streaming";
    requestType: string;
    responseType: string;
}
export declare function configFromEnv(): ServerContextOptions;
//# sourceMappingURL=context.d.ts.map