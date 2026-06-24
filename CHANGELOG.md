# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.1] - 2026-06-24

### Fixed
- `invoke_rpc` parameter type changed from `z.any()` to `z.record(z.unknown())` for better type discovery quality score on Glama

## [0.1.0] - 2026-06-24

### Added
- `connect_endpoint` — connect to any gRPC server with reflection enabled
- `disconnect` — clear cached service data
- `list_services` — list all discovered gRPC services
- `list_methods` — list RPC methods for a specific service
- `get_service_descriptor` — full service schema including method types and request/response names
- `invoke_rpc` — call any RPC method with JSON-serialized request body
- `health_check` — standard gRPC Health Checking Protocol (v1)
- Server reflection support (v1alpha) for automatic service discovery
- TLS support via `GRPC_USE_TLS` environment variable
- Configurable timeout via `GRPC_TIMEOUT_MS` environment variable
- Pre-configured endpoint via `GRPC_ENDPOINT` environment variable
- TypeScript source with full test suite (9 tests)
