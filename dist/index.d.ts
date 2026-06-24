#!/usr/bin/env node
/**
 * Entry point for the gRPC MCP server.
 *
 * Starts an MCP server over stdio. The agent connects via stdio, then
 * calls `connect_endpoint` (or relies on the GRPC_ENDPOINT env var) to
 * point the server at a gRPC backend.
 *
 * Environment variables:
 *   GRPC_ENDPOINT        Target endpoint (e.g. localhost:50051)
 *   GRPC_SERVICE_CONFIG  Optional service config JSON
 *   GRPC_TIMEOUT_MS      Request timeout in ms (optional, default 10000)
 *   GRPC_USE_TLS         Set to "true" for TLS connections
 */
export {};
//# sourceMappingURL=index.d.ts.map