import { Hono, serveStatic } from "$deps/hono.ts";
import { handleMain } from "./handle_main.tsx";

if (import.meta.main) {
    const app = new Hono();
    app.use("*", async (c, next) => {
        if (c.req.path === "/favicon.ico") {
            return c.body(null);
        }
        await next();
    });

    app.get("/:count{[0-9]+}?", handleMain());
    app.use("/*", serveStatic({ root: "./static/" }));

    Deno.serve(app.fetch);
}
