import { createClient } from "$lib/libsql/dyedgreen/create_client.ts";
import { Hono } from "$deps/hono.ts";

const { env, exit, readTextFile, serve } = Deno;

const url = env.get("DATABASE_URL")!;
const authToken = env.get("TURSO_AUTH_TOKEN");

if (import.meta.main) {
    const db = createClient({
        url,
        authToken,
    });

    const app = new Hono();
    app.get("/", async (c) => {
        const rs = await db.execute("SELECT 42");
        const row = rs.rows.at(0);
        if (!row) return c.body(null, 500);

        const [value] = Object.values(row);
        c.json({ value });
    });

    serve(app.fetch);
}
