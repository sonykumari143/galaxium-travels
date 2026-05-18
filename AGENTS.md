# AGENTS.md

This is a demo system mimicking real enterprise challenges to showcase AI-native IDE Bob capabilities.

This file provides guidance to agents when working with code in this repository.

## Critical Non-Obvious Patterns

### Backend Architecture
- **MCP server MUST be created before FastAPI app** (server.py line 22) - Lifespan combination requirement
- **MCP tools bypass FastAPI DI** - Use `SessionLocal()` directly, must manually close sessions
- **Service functions return Union[Model, ErrorResponse]** - Never raise exceptions, always return error objects
- **Name+user_id dual validation** - book_flight() requires BOTH to match (non-standard security pattern)
- **SQLite is intentional production DB** - `DATABASE_URL` env var unset in ECS triggers SQLite fallback (db.py line 7-9)
- **Data ephemeral in ECS** - SQLite on container filesystem; re-seeds via `SEED_DEMO_DATA=true` each task start
- **Seed preserves existing users** - seed.py checks user count > 0 to avoid wiping registrations (line 15)

### Testing
- **StaticPool required for in-memory SQLite** - Thread safety in tests (conftest.py line 21)
- **Double SessionLocal patch** - Must patch BOTH `db.SessionLocal` AND `server.SessionLocal` (conftest.py lines 49-50)
- **Seed explicitly disabled** - Patched to prevent test data pollution (conftest.py line 53)
- **Run single test**: `cd booking_system_backend && pytest tests/test_services.py::test_name -v`

### Frontend
- **Error detection via success field** - Check `response.success === false`, not HTTP status codes (api.ts)
- **Vite proxy strips /api prefix** - Dev requests to `/api/foo` become `http://localhost:8001/foo` (vite.config.ts lines 9-13)
- **Env vars use import.meta.env** - Not process.env (Vite-specific, api.ts line 15)

## Commands
- **Backend tests**: `cd booking_system_backend && pytest` (must run from backend dir)
- **Start both**: `./start.sh` (wrapper to deployment_scripts/local/start_locally.sh)
- **Java service gracefully skipped** - Startup script handles missing inventory_hold_service directory