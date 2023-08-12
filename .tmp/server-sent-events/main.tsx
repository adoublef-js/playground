import { Hono } from "$deps/hono.ts";
import { handleMain } from "./handle_home.tsx";
import { handleSse } from "./handle_sse.tsx";

if (import.meta.main) {
    const app = new Hono();

    app.get("/", handleMain());
    app.get("/_", handleSse());

    Deno.serve(app.fetch);
}
