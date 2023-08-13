import { createClient as createLibSqlClient } from "$lib/libsql/denodrivers/create_client.ts";
import { LibSqlClient } from "$deps/libsql.ts";
import { fromFileUrl } from "$deps/std/path.ts";

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
