/**
 * gRPC invocation engine.
 *
 * Handles calling gRPC methods using the low-level channel API.
 */
import * as grpc from "@grpc/grpc-js";
/**
 * Invoke a gRPC unary method on a channel.
 */
export async function invokeMethod(channel, serviceName, methodName, request, options = {}) {
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
                requestSerialize: (value) => Buffer.from(JSON.stringify(value)),
                requestDeserialize: (buffer) => JSON.parse(buffer.toString()),
                responseSerialize: (value) => Buffer.from(JSON.stringify(value)),
                responseDeserialize: (buffer) => JSON.parse(buffer.toString()),
            },
        };
        const GenericClient = grpc.makeGenericClientConstructor(serviceDefinition, serviceName, {});
        const client = new GenericClient("dummy", grpc.credentials.createInsecure());
        // Point the client at our channel
        client._channel = channel;
        client[methodName](request, metadata, { deadline }, (err, response) => {
            if (err) {
                resolve({
                    success: false,
                    error: `gRPC error ${err.code || "unknown"}: ${err.details || err.message || String(err)}`,
                });
            }
            else {
                resolve({ success: true, data: response });
            }
        });
    });
}
//# sourceMappingURL=invoke.js.map