import { Hono, logger, serveStatic } from "$deps/hono.ts";
import { handleFormSubmit, handleHomePage } from "./http.tsx";

const { exit, serve } = Deno;

if (import.meta.main) {
    const app = new Hono();

    app.use("*", logger());

    app.get("/", handleHomePage());
    app.post("/", handleFormSubmit());

    app.use("*", serveStatic({ root: "static/" }));

    serve(app.fetch);
}
