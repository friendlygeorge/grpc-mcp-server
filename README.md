# @supernova123/grpc-mcp-server

**Connect AI agents to any gRPC service — no proto files needed.**

Most gRPC services are invisible to AI tools. This MCP server uses [gRPC Server Reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) to auto-discover services, methods, and types at runtime, then exposes them as callable tools for Claude, Cursor, and any MCP-compatible agent.

## Why This Matters

gRPC powers Kubernetes, Istio, Envoy, and thousands of microservices — but AI agents can't talk to any of them. Until now, you'd need to manually define proto schemas, generate clients, and wire everything together. This server does it automatically: point it at any gRPC endpoint with reflection enabled, and it discovers everything.

**Use cases:**
- Debug microservices by invoking RPCs directly from Claude
- Inspect live service meshes (Istio, Envoy) without kubectl
- Build AI-powered ops tools that query gRPC health endpoints
- Prototype API integrations without writing client code
- Test gRPC services during development with natural language

## Tools

| Tool | Description |
|------|-------------|
| `connect_endpoint` | Connect to a gRPC server and auto-discover all services via reflection |
| `list_services` | List every gRPC service on the connected endpoint |
| `list_methods` | List all RPC methods for a service (unary, server-stream, client-stream, bidi) |
| `get_service_descriptor` | Get full service schema: methods, request/response types, streaming modes |
| `invoke_rpc` | Call any RPC method with a JSON-serialized request body |
| `health_check` | Standard gRPC Health Checking Protocol (v1) |
| `disconnect` | Clear cached service data and disconnect |

## Quick Start

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "grpc": {
      "command": "npx",
      "args": ["-y", "@supernova123/grpc-mcp-server"],
      "env": {
        "GRPC_ENDPOINT": "localhost:50051"
      }
    }
  }
}
```

### Cursor / VS Code

```json
{
  "mcp": {
    "servers": {
      "grpc": {
        "command": "npx",
        "args": ["-y", "@supernova123/grpc-mcp-server"],
        "env": {
          "GRPC_ENDPOINT": "localhost:50051"
        }
      }
    }
  }
}
```

### Direct

```bash
npx @supernova123/grpc-mcp-server
```

## Example Usage

1. **Connect** to a gRPC server:
   ```
   connect_endpoint(endpoint="localhost:50051")
   ```

2. **Discover** available services:
   ```
   list_services()
   ```

3. **Inspect** a service's methods:
   ```
   list_methods(service_name="grpc.health.v1.Health")
   ```

4. **Invoke** an RPC:
   ```
   invoke_rpc(
     service_name="grpc.health.v1.Health",
     method_name="Check",
     request={"service": ""}
   )
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GRPC_ENDPOINT` | Target gRPC endpoint (host:port) | *(none — use `connect_endpoint`)* |
| `GRPC_TIMEOUT_MS` | Request timeout in milliseconds | `10000` |
| `GRPC_USE_TLS` | Enable TLS connections | `false` |

## Requirements

- **Node.js 18+**
- Target gRPC server must support [gRPC Server Reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) (v1)

Most gRPC servers have reflection enabled in development. For production servers, ensure `grpc.reflection.V1Reflection` is registered.

## How It Works

1. Connects to your gRPC endpoint via the reflection API
2. Fetches the full service descriptor (services → methods → types)
3. Dynamically generates MCP tool definitions from the schema
4. Invokes RPCs by serializing JSON requests to protobuf and back

No proto files. No code generation. No compile step.

## License

MIT
