import { Hono } from "$deps/hono.ts";
import { handleMain } from "./handle_main.tsx";

if (import.meta.main) {
    const app = new Hono();

    app.get("/", handleMain());

    Deno.serve(app.fetch);
}
