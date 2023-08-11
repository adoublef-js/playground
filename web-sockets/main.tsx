import { Hono } from "$deps/hono.ts";
import { handleCreateConnection } from "./handle_create_connection.tsx";
import { handleMain } from "./handle_home.tsx";
import { handleWebSockets } from "./handle_web_sockets.tsx";

if (import.meta.main) {
    const app = new Hono();

    app.get("/", handleMain());
    app.get("/chat", handleWebSockets());
    app.get("/connect", handleCreateConnection());

    Deno.serve(app.fetch);
}
