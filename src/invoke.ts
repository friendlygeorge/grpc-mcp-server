/**
 * gRPC invocation engine.
 *
 * Handles calling gRPC methods using the low-level channel API.
 */

import * as grpc from "@grpc/grpc-js";
import type { MethodInfo } from "./context.js";

export interface InvokeResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Invoke a gRPC unary method on a channel.
 */
export async function invokeMethod(
  channel: grpc.Channel,
  serviceName: string,
  methodName: string,
  request: any,
  options: {
    timeoutMs?: number;
    metadata?: Record<string, string>;
  } = {}
): Promise<InvokeResult> {
  const timeoutMs = options.timeoutMs || 10000;
  const methodPath = `/${serviceName}/${methodName}`;

  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;

    // Build metadata if provided
    const metadata = new grpc.Metadata();
    if (options.metadata) {
      for (const [key, value] of Object.entries(options.metadata)) {
        metadata.add(key, value);
      }
    }

    // Create a generic client constructor for this method path
    const serviceDefinition = {
      [methodName]: {
        path: methodPath,
        requestStream: false,
        responseStream: false,
        requestSerialize: (value: any) => Buffer.from(JSON.stringify(value)),
        requestDeserialize: (buffer: Buffer) => JSON.parse(buffer.toString()),
        responseSerialize: (value: any) => Buffer.from(JSON.stringify(value)),
        responseDeserialize: (buffer: Buffer) => JSON.parse(buffer.toString()),
      },
    };

    const GenericClient = grpc.makeGenericClientConstructor(serviceDefinition, serviceName, {});
    const client = new GenericClient("dummy", grpc.credentials.createInsecure());

    // Point the client at our channel
    (client as any)._channel = channel;

    (client as any)[methodName](request, metadata, { deadline }, (err: any, response: any) => {
      if (err) {
        resolve({
          success: false,
          error: `gRPC error ${err.code || "unknown"}: ${err.details || err.message || String(err)}`,
        });
      } else {
        resolve({ success: true, data: response });
      }
    });
  });
}
