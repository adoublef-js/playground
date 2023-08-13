import { LibSqlClient } from "$deps/libsql.ts";
import { SetOptional } from "$deps/type-fest.ts";
import { Ulid } from "$lib/id/ulid.ts";

export async function createUser(
    c: LibSqlClient,
    {
        id = new Ulid(),
        username,
        email,
        photoUrl,
    }: SetOptional<
        {
            id: Ulid;
            username: string;
            email: string;
            photoUrl?: string;
        },
        "id"
    >,
    sessionId: string
): Promise<Ulid> {
    const _ = await c.batch([
        {
            sql: `
            INSERT INTO users (id, user_name, email, photo_url)
            VALUES (?, ?, ?, ?)
            `,
            args: [id.toString(), username, email, photoUrl ?? null],
        },
        {
            sql: `
            -- TODO should add time and other metadata
            INSERT INTO users_sessions (session, user)
            VALUES (?, ?)
            `,
            args: [sessionId, id.toString()],
        },
    ]);

    // handle error

    return id;
}
