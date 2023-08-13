import { createClient } from "$lib/libsql/dyedgreen/create_client.ts";
import { Hono, logger } from "$deps/hono.ts";

const { env, exit, readTextFile, serve } = Deno;

const url = env.get("DATABASE_URL")!;
const authToken = env.get("TURSO_AUTH_TOKEN");

if (import.meta.main) {
    const db = createClient({
        url,
        authToken,
    });

    const app = new Hono();

    app.use("*", logger());

    app.get("/", async (c) => {
        const rs = await db.execute("SELECT 42");
        const row = rs.rows.at(0);
        if (!row) return c.body(null, 500);

        const [value] = Object.values(row);
        // c.json({ value });
        return c.json({ value });
    });

    const port = Number(env.get("PORT") || "8000");
    serve({ port }, app.fetch);
}
