import { LibSqlClient } from "$deps/libsql.ts";
import { Ulid } from "$lib/id/ulid.ts";

export type User = {
    id: Ulid;
    username: string;
    email: string;
    photoUrl?: string;
};

export async function getUser(
    c: LibSqlClient,
    email: string
): Promise<User | null> {
    const rs = await c.execute({
        sql: `
        SELECT id, user_name, email, photo_url FROM users
        WHERE email = ? 
        `,
        args: [email],
    });

    const row = rs.rows.at(0);
    if (!row) return null;

    const [id, username, _, photoUrl] = Object.values(row);
    return {
        id: new Ulid(id?.toString()),
        username: username!.toString(),
        email,
        photoUrl: photoUrl?.toString(),
    };
}
