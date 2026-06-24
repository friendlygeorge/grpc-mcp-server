/**
 * Shared server context for gRPC connections.
 *
 * Holds the active gRPC client channel and reflection data.
 * Configured once (via env or connect_endpoint), then shared by all tools.
 */
import * as grpc from "@grpc/grpc-js";
export class ServerContext {
    endpoint = null;
    channel = null;
    timeoutMs = 10000;
    useTls = false;
    /** All discovered service definitions (from reflection). */
    services = new Map();
    configure(opts) {
        if (opts.endpoint)
            this.endpoint = opts.endpoint;
        if (opts.timeoutMs)
            this.timeoutMs = opts.timeoutMs;
        if (opts.useTls !== undefined)
            this.useTls = opts.useTls;
        const creds = this.useTls
            ? grpc.credentials.createSsl()
            : grpc.credentials.createInsecure();
        this.channel = new grpc.Channel(this.endpoint, creds, {});
    }
    isConfigured() {
        return this.channel !== null;
    }
    getEndpoint() {
        return this.endpoint ?? "(not configured)";
    }
    getChannel() {
        return this.channel;
    }
    getTimeoutMs() {
        return this.timeoutMs;
    }
    setServices(services) {
        this.services = services;
    }
    getServices() {
        return this.services;
    }
    getService(name) {
        return this.services.get(name);
    }
    disconnect() {
        if (this.channel) {
            this.channel.close();
            this.channel = null;
        }
        this.services.clear();
    }
}
export function configFromEnv() {
    return {
        endpoint: process.env.GRPC_ENDPOINT || undefined,
        timeoutMs: process.env.GRPC_TIMEOUT_MS
            ? parseInt(process.env.GRPC_TIMEOUT_MS, 10)
            : undefined,
        useTls: process.env.GRPC_USE_TLS === "true",
    };
}
//# sourceMappingURL=context.js.map