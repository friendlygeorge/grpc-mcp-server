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

export class ServerContext {
  private endpoint: string | null = null;
  private channel: grpc.Channel | null = null;
  private timeoutMs: number = 10000;
  private useTls: boolean = false;

  /** All discovered service definitions (from reflection). */
  private services: Map<string, ServiceInfo> = new Map();

  configure(opts: ServerContextOptions): void {
    if (opts.endpoint) this.endpoint = opts.endpoint;
    if (opts.timeoutMs) this.timeoutMs = opts.timeoutMs;
    if (opts.useTls !== undefined) this.useTls = opts.useTls;

    const creds = this.useTls
      ? grpc.credentials.createSsl()
      : grpc.credentials.createInsecure();

    this.channel = new grpc.Channel(this.endpoint!, creds, {});
  }

  isConfigured(): boolean {
    return this.channel !== null;
  }

  getEndpoint(): string {
    return this.endpoint ?? "(not configured)";
  }

  getChannel(): grpc.Channel | null {
    return this.channel;
  }

  getTimeoutMs(): number {
    return this.timeoutMs;
  }

  setServices(services: Map<string, ServiceInfo>): void {
    this.services = services;
  }

  getServices(): Map<string, ServiceInfo> {
    return this.services;
  }

  getService(name: string): ServiceInfo | undefined {
    return this.services.get(name);
  }

  disconnect(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.services.clear();
  }
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

export function configFromEnv(): ServerContextOptions {
  return {
    endpoint: process.env.GRPC_ENDPOINT || undefined,
    timeoutMs: process.env.GRPC_TIMEOUT_MS
      ? parseInt(process.env.GRPC_TIMEOUT_MS, 10)
      : undefined,
    useTls: process.env.GRPC_USE_TLS === "true",
  };
}
