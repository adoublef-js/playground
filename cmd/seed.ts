import { LibSqlClient } from "$deps/libsql.ts";
import { createClient } from "$lib/libsql/create_client.ts";

/** [TODO](https://blog.warrant.dev/implementing-role-based-access-control/) */
export async function seed(c: LibSqlClient) {
    const _ = await c.batch([
        `DROP TABLE IF EXISTS roles_permissions`,
        `DROP TABLE IF EXISTS users_permissions`,
        `DROP TABLE IF EXISTS users_sessions`,
        `DROP TABLE IF EXISTS permissions`,
        `DROP TABLE IF EXISTS roles`,
        `DROP TABLE IF EXISTS users`,
        `CREATE TABLE users (
            id TEXT,
            user_name TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            photo_url TEXT,
            PRIMARY KEY (id)
        )`,
        `
        -- associates a privileged action (i.e. user:create)
        CREATE TABLE permissions (
            id TEXT,
            PRIMARY KEY (id)
        )`,
        `
        -- group of permissions (i.e. free_tier_user)
        CREATE TABLE roles (
            id TEXT,
            PRIMARY KEY (id)
        )`,
        `CREATE TABLE users_sessions (
            session TEXT,
            user TEXT,
            FOREIGN KEY (user) REFERENCES users (id),
            PRIMARY KEY (session)
        )`,
        `CREATE TABLE roles_permissions (
            role TEXT,
            permission TEXT,
            FOREIGN KEY (role) REFERENCES roles (id),
            FOREIGN KEY (permission) REFERENCES permissions (id),
            PRIMARY KEY (role, permission)
        );`,
        `CREATE TABLE users_roles (
            role TEXT,
            user TEXT,
            FOREIGN KEY (role) REFERENCES roles (id),
            FOREIGN KEY (user) REFERENCES users (id),
            PRIMARY KEY (role, user)
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
