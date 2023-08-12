import { Handler } from "$deps/hono.ts";
import { handleCallback as hc } from "$deps/deno_kv_oauth.ts";
import { IamEnv } from "./middleware.ts";
import { getGoogleUser } from "./get_google_user.ts";
import { LibSqlClient } from "$deps/libsql.ts";
import { Ulid } from "$lib/id/ulid.ts";
import { SetOptional } from "$deps/type-fest.ts";
import { LibSqlEnv } from "$lib/libsql/middleware.ts";

/** [TODO](https://github.com/denoland/saaskit/blob/main/routes/callback.ts) */
export function handleCallback<
    T extends IamEnv & LibSqlEnv = IamEnv & LibSqlEnv
>(): Handler<T> {
    return async ({ req, get, header, redirect }) => {
        const { response, accessToken, sessionId } = await hc(
            req.raw,
            get("iam")
        );

        const googleUser = await getGoogleUser(accessToken);

        const user = await getUser(get("dao"), googleUser.email);
        /* use a throw instead */
        if (!user) {
            const user = {
                username: googleUser.name,
                email: googleUser.email,
                photoUrl: googleUser.picture,
            };
            console.log("createUser?", sessionId);
            const _ = await createUser(get("dao"), user, sessionId);
        } else {
            // set sessions from database
            const _ = await createSessionByUser(get("dao"), user, sessionId);
        }

        header("set-cookie", response.headers.get("set-cookie")!);
        return redirect(response.headers.get("location")!, response.status);
    };
}

/* DB HELPERS */

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
            INSERT INTO sessions_users (session, user)
            VALUES (?, ?)
            `,
            args: [sessionId, id.toString()],
        },
    ]);

    // handle error

    return id;
}

export async function createSessionByUser(
    c: LibSqlClient,
    { id }: Pick<User, "id">,
    sessionId: string
): Promise<number> {
    const rs = await c.execute({
        sql: `
        -- TODO should add time and other metadata
        INSERT INTO sessions_users (session, user)
        VALUES (?, ?)
        `,
        args: [sessionId, id.toString()],
    });

    return rs.rowsAffected;
}
