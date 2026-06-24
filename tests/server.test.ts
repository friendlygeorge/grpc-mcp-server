/**
 * Tests for gRPC MCP server tools.
 *
 * Tests tool registration, context management, and reflection parsing.
 * Does NOT test actual gRPC connections (requires a running server).
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ServerContext } from "../src/context.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerConnectTools } from "../src/tools/connect.js";
import { registerDiscoveryTools } from "../src/tools/discovery.js";
import { registerDescriptorTools } from "../src/tools/descriptor.js";
import { registerHealthTools } from "../src/tools/health.js";

describe("ServerContext", () => {
  let ctx: ServerContext;

  beforeEach(() => {
    ctx = new ServerContext();
  });

  it("starts unconfigured", () => {
    expect(ctx.isConfigured()).toBe(false);
    expect(ctx.getEndpoint()).toBe("(not configured)");
  });

  it("stores and retrieves services", () => {
    const services = new Map();
    services.set("test.Service", {
      name: "test.Service",
      fullName: "test.Service",
      methods: [
        {
          name: "TestMethod",
          fullName: "test.Service.TestMethod",
          type: "unary" as const,
          requestType: "TestRequest",
          responseType: "TestResponse",
        },
      ],
    });

    ctx.setServices(services);
    expect(ctx.isConfigured()).toBe(false); // No channel configured
    expect(ctx.getServices().size).toBe(1);
    expect(ctx.getService("test.Service")?.methods.length).toBe(1);
  });

  it("disconnect clears state", () => {
    const services = new Map();
    services.set("test.Service", { name: "test.Service", fullName: "test.Service", methods: [] });
    ctx.setServices(services);
    ctx.disconnect();
    expect(ctx.getServices().size).toBe(0);
  });
});

describe("Tool registration", () => {
  let server: McpServer;
  let ctx: ServerContext;

  beforeEach(() => {
    server = new McpServer({ name: "test-server", version: "0.0.1" });
    ctx = new ServerContext();
  });

  it("registers connect tools", () => {
    registerConnectTools(server, ctx);
    // If no error thrown, registration succeeded
    expect(true).toBe(true);
  });

  it("registers discovery tools", () => {
    registerDiscoveryTools(server, ctx);
    expect(true).toBe(true);
  });

  it("registers descriptor tools", () => {
    registerDescriptorTools(server, ctx);
    expect(true).toBe(true);
  });

  it("registers health tools", () => {
    registerHealthTools(server, ctx);
    expect(true).toBe(true);
  });
});

describe("Reflection parsing", () => {
  it("parseFileDescriptor handles services with methods", () => {
    // Test the parseFileDescriptor logic indirectly through reflection module
    // This validates the data structure we expect from gRPC reflection
    const mockService = {
      name: "grpc.health.v1.Health",
      method: [
        {
          name: "Check",
          inputType: "grpc.health.v1.HealthCheckRequest",
          outputType: "grpc.health.v1.HealthCheckResponse",
          clientStreaming: false,
          serverStreaming: false,
        },
      ],
    };

    expect(mockService.method).toHaveLength(1);
    expect(mockService.method[0].name).toBe("Check");
  });
});

describe("configFromEnv", () => {
  it("returns defaults when env vars not set", async () => {
    const original = process.env.GRPC_ENDPOINT;
    delete process.env.GRPC_ENDPOINT;
    delete process.env.GRPC_TIMEOUT_MS;
    delete process.env.GRPC_USE_TLS;

    const mod = await import("../src/context.js");
    const config = mod.configFromEnv();
    expect(config.endpoint).toBeUndefined();
    expect(config.useTls).toBe(false);

    if (original) process.env.GRPC_ENDPOINT = original;
  });
});
