/**
 * gRPC server reflection client.
 *
 * Uses the standard gRPC server reflection protocol (v1) to discover
 * services, methods, and type information from a running gRPC endpoint.
 */
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
/**
 * Load the reflection service definition.
 */
function loadReflectionProto() {
    // Find the reflection proto bundled with @grpc/grpc-js
    const grpcPkgPath = require.resolve("@grpc/grpc-js");
    const grpcRoot = grpcPkgPath.replace(/\/build\/src\/index\.js$/, "");
    const reflectionProto = `${grpcRoot}/proto/grpc/reflection/v1alpha/reflection.proto`;
    const packageDef = protoLoader.loadSync(reflectionProto, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const proto = grpc.loadPackageDefinition(packageDef);
    return proto.grpc.reflection.v1alpha.ServerReflection;
}
/**
 * Query the server reflection API and return all services/methods.
 */
export async function reflectServices(channel, timeoutMs = 10000) {
    const ReflectionCtor = loadReflectionProto();
    // Create a client using the same channel
    const client = new ReflectionCtor("dummy", grpc.credentials.createInsecure());
    // Override internal channel reference
    client._channel = channel;
    const services = new Map();
    return new Promise((resolve, reject) => {
        const call = client.ServerReflectionInfo({ deadline: Date.now() + timeoutMs });
        call.on("data", (response) => {
            if (response.fileByFilename) {
                for (const fileDesc of response.fileByFilename) {
                    parseFileDescriptor(fileDesc, services);
                }
            }
            if (response.listServicesResponse) {
                for (const svc of response.listServicesResponse.service) {
                    call.write({ fileContainingSymbol: svc.name });
                }
                call.end();
            }
        });
        call.on("end", () => resolve(services));
        call.on("error", (err) => reject(err));
        // Start by listing services
        call.write({ listServices: "" });
        setTimeout(() => {
            try {
                call.end();
            }
            catch { }
            resolve(services);
        }, timeoutMs);
    });
}
function parseFileDescriptor(fileDesc, services) {
    if (!fileDesc.service)
        return;
    for (const svc of fileDesc.service) {
        const methods = [];
        if (svc.method) {
            for (const m of svc.method) {
                methods.push({
                    name: m.name,
                    fullName: `${svc.name}.${m.name}`,
                    type: getMethodType(m),
                    requestType: m.inputType || "unknown",
                    responseType: m.outputType || "unknown",
                });
            }
        }
        services.set(svc.name, {
            name: svc.name,
            fullName: svc.name,
            methods,
        });
    }
}
function getMethodType(method) {
    if (method.clientStreaming && method.serverStreaming)
        return "bidi_streaming";
    if (method.clientStreaming)
        return "client_streaming";
    if (method.serverStreaming)
        return "server_streaming";
    return "unary";
}
//# sourceMappingURL=reflection.js.map