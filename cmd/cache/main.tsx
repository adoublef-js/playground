import { Hono, logger, cache, etag, serveStatic } from "$deps/hono.ts";
import { createClient as createLibSqlClient } from "$lib/libsql/denodrivers/create_client.ts";
import { TursoEnv, turso } from "./middleware.ts";
import {
    handleCreateComments,
    handleDeleteCommentsById,
    handleListCommentsByArticle,
    handleGetCommentsById,
    handleListComments,
    handleListCommentsByUser,
    handleHomePage,
    handleUserPage,
    handleArticlePage,
    handleFormOptions,
} from "./http.tsx";

const { exit, serve } = Deno;

if (import.meta.main) {
    const db = createLibSqlClient({ url: "file:cmd/cache/database.db" });
    try {
        if (!(await db.execute("SELECT 1")).rows.at(0)) {
            throw new Error("failed to ping");
        }
    } catch (error) {
        console.log("Ouch, Charlie: ", error.message);
        exit(1);
    }

    const app = new Hono<TursoEnv>();

    app.use("*", logger(), turso(db));

    app.get("/", handleHomePage());
    app.get("/users/:id", handleUserPage());
    app.get("/articles/:id", handleArticlePage());

    app.get("/forms", handleFormOptions());

    app.get("/comments", handleListComments());
    app.get("/comments/:id", handleGetCommentsById());
    app.post("/comments", handleCreateComments());
    app.delete("/comments/:id", handleDeleteCommentsById());

    app.get("/articles/:id/comments", handleListCommentsByArticle());
    app.get("/users/:id/comments", handleListCommentsByUser());

    app.use("*", serveStatic({ root: "static/" }));

    serve(app.fetch);
}
