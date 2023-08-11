import { Hono } from "$deps/hono.ts";
import { handleCreateConnection } from "./web-sockets/handle_create_connection.tsx";
import { handleMain } from "./web-sockets/handle_home.tsx";
import { handleWebSockets } from "./web-sockets/handle_web_sockets.tsx";

if (import.meta.main) {
    const app = new Hono();

    app.get("/", handleMain());
    app.get("/chat", handleWebSockets());
    app.get("/connect", handleCreateConnection());

    Deno.serve(app.fetch);
}
