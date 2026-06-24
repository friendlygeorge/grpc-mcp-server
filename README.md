# @supernova123/grpc-mcp-server

MCP server for gRPC — service discovery via server reflection, method invocation, and type schema inspection for AI agents.

## Features

- **Service Discovery** — Automatically discover all gRPC services via server reflection
- **Method Invocation** — Call any RPC method with JSON-serialized requests
- **Health Checking** — Standard gRPC Health Checking Protocol support
- **Type Inspection** — View service descriptors, method signatures, and streaming modes
- **Generic** — Works with any gRPC endpoint (no proto files required)

## Tools

| Tool | Description |
|------|-------------|
| `connect_endpoint` | Connect to a gRPC server and discover services via reflection |
| `list_services` | List all discovered gRPC services |
| `list_methods` | List all methods for a specific service |
| `get_service_descriptor` | Get full service descriptor with method details |
| `invoke_rpc` | Call any RPC method with a JSON request body |
| `health_check` | Standard gRPC health check protocol |
| `disconnect` | Disconnect and clear cached data |

## Quick Start

```bash
npx @supernova123/grpc-mcp-server
```

Or with environment variables:

```bash
GRPC_ENDPOINT=localhost:50051 npx @supernova123/grpc-mcp-server
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GRPC_ENDPOINT` | Target gRPC endpoint | (none — use `connect_endpoint`) |
| `GRPC_TIMEOUT_MS` | Request timeout in ms | `10000` |
| `GRPC_USE_TLS` | Enable TLS connections | `false` |

## Example Usage

1. Connect to a gRPC server:
   ```
   connect_endpoint(endpoint="localhost:50051")
   ```

2. Discover available services:
   ```
   list_services()
   ```

3. List methods for a service:
   ```
   list_methods(service_name="grpc.health.v1.Health")
   ```

4. Invoke an RPC method:
   ```
   invoke_rpc(
     service_name="grpc.health.v1.Health",
     method_name="Check",
     request={"service": ""}
   )
   ```

## Requirements

- Node.js 18+
- Target gRPC server must support [gRPC Server Reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) (v1)

## License

MIT
