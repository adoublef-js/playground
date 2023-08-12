import { LibSqlClient } from "$deps/libsql.ts";
import { createClient } from "$lib/libsql/create_client.ts";

export async function seed(c: LibSqlClient) {
    const _ = await c.batch([
        `DROP TABLE IF EXISTS sessions_users`,
        `DROP TABLE IF EXISTS users`,
        `CREATE TABLE users (
            id TEXT,
            user_name TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            photo_url TEXT,
            PRIMARY KEY (id)
        )`,
        `CREATE TABLE sessions_users (
            session TEXT,
            user TEXT,
            CONSTRAINT fx_users FOREIGN KEY (user) REFERENCES users (id),
            PRIMARY KEY (session, user)
        )`,
    ]);
}

const { env, exit } = Deno;

const url = env.get("DATABASE_URL");
if (!url) {
    console.error('Must configure "DATABASE_URL"');
    exit(1);
} else {
    const db = createClient({ url });

    try {
        await seed(db);
    } catch (error) {
        console.error("seeding error: ", error.message);

        exit(1);
    } finally {
        db.close();

        exit(0);
    }
}
