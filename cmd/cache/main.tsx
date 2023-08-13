import { Hono } from "$deps/hono.ts";
import { createClient as createLibSqlClient } from "$lib/libsql/denodrivers/create_client.ts";
import { LibSqlClient } from "$deps/libsql.ts";
import { fromFileUrl } from "$deps/std/path.ts";
import { Ulid } from "$lib/id/ulid.ts";

const { exit, readTextFile } = Deno;

if (import.meta.main) {
    const db = createLibSqlClient({ url: "file:cmd/cache/database.db" });
    try {
        if (!(await db.execute("SELECT 1")).rows.at(0)) {
            throw new Error("failed to ping");
        }
        await createTables(db);
        await seedDatabase(db);
    } catch (error) {
        console.log("Ouch, Charlie: ", error.message);
        exit(1);
    }

    const app = new Hono();

    app.get("/comment", async (c) => {
        const _ = await getAllComments(db);

        return c.body(null);
    });

    app.get("/comment/:id", (c) => {
        return c.body(null);
    });

    app.post("/comment", async (c) => {
        // get from json body
        const { content, user, article } = await c.req.json();

        const id = await createArticleCommentByUser(
            db,
            content as string,
            user as string,
            article as string
        );

        if (!id) {
            return c.text("Error", 500);
        }

        c.header("location", `/comment/${id?.toString()}`);
        return c.body(null, 201);
    });

    app.delete("/comment/:id", (c) => {
        return c.body(null);
    });

    app.get("/articles/:article_id/comments", (c) => {
        return c.body(null);
    });

    app.get("/user/:user_id/comments", (c) => {
        return c.body(null);
    });

    Deno.serve(app.fetch);
}

/* DATABASE UTILS */

export async function readSqlFile(path: string) {
    const url = fromFileUrl(import.meta.resolve(path));
    return (await readTextFile(url))
        .split(";")
        .filter(Boolean)
        .map((stmt) => stmt.trim());
}

export async function createTables(db: LibSqlClient) {
    const stmts = await readSqlFile("./create_tables.sql");
    return await db.batch(stmts);
}

export async function seedDatabase(db: LibSqlClient) {
    const stmts = await readSqlFile("./seed_database.sql");
    const _ = await db.batch(stmts);
}

export async function getAllComments(db: LibSqlClient) {
    const rs = await db.execute(`
        SELECT 
            c.id AS comment_id
        ,   c.content AS comment_content
        ,   u.id AS commentor_id
        ,   a.id AS article_id
        ,   a.content AS article_content
        ,   v.id AS author_id
        FROM comments AS c
        INNER JOIN users AS u 
            ON u.id = c.user
        INNER JOIN articles AS a
            ON a.id = c.article
        INNER JOIN users AS v
            ON v.id = a.user;
    `);

    console.log(rs.rows);
}

export async function createArticleCommentByUser(
    db: LibSqlClient,
    content: string,
    user: string,
    article: string
) {
    if (!content || !content.length) return null;

    const id = new Ulid();
    const rs = await db.execute({
        sql: `
        INSERT INTO comments (id, content, user, article)
        VALUES (?, ?, ?, ?)`,
        args: [new Ulid().toString(), content, user, article],
    });
    if (!rs.rowsAffected) return null;

    return id;
}
