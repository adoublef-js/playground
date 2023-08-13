import { LibSqlClient } from "$deps/libsql.ts";
import { Ulid } from "$lib/id/ulid.ts";

export type User = {
    id: Ulid;
    username: string;
    email: string;
    photoUrl?: string;
};

export async function getUserBySession(
    c: LibSqlClient,
    sessionId: string
): Promise<User | null> {
    const rs = await c.execute({
        sql: `
            SELECT u.id, u.user_name, u.email, u.photo_url 
            FROM users AS u
            JOIN users_sessions AS s ON u.id = s.user
            WHERE s.session = ?  
        `,
        args: [sessionId],
    });

    const row = rs.rows.at(0);
    if (!row) return null;

    const [id, username, email, photoUrl] = Object.values(row);
    return {
        id: new Ulid(id?.toString()),
        username: username!.toString(),
        email: email!.toString(),
        photoUrl: photoUrl?.toString(),
    };
}
