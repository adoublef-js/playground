import { LibSqlClient } from "$deps/libsql.ts";
import { Ulid } from "$lib/id/ulid.ts";

export type User = {
    id: Ulid;
    username: string;
    email: string;
    photoUrl?: string;
};

export async function createUserSession(
    c: LibSqlClient,
    { id }: Pick<User, "id">,
    sessionId: string
): Promise<number> {
    const rs = await c.execute({
        sql: `
        -- TODO should add time and other metadata
        INSERT INTO users_sessions (session, user)
        VALUES (?, ?)
        `,
        args: [sessionId, id.toString()],
    });

    return rs.rowsAffected;
}
