import { Handler } from "$deps/hono.ts";
import { Html } from "$components/dom/mod.ts";
import { getSessionId } from "$deps/deno_kv_oauth.ts";
import { IamEnv } from "./iam/middleware.ts";
import { toHashString, crypto } from "$deps/std/crypto.ts";
import { LibSqlEnv } from "$lib/libsql/middleware.ts";
import { LibSqlClient } from "$deps/libsql.ts";
import { Ulid } from "$lib/id/ulid.ts";
import { Show } from "$components/control/show.tsx";
import { For } from "$components/control/for.tsx";

export function handleMain<
    T extends IamEnv & LibSqlEnv = IamEnv & LibSqlEnv
>(): Handler<T> {
    return async (c) => {
        const sessionId = getSessionId(c.req.raw);
        const isSignedIn = sessionId !== undefined;
        const user = isSignedIn
            ? await getUserBySession(c.get("dao"), sessionId)
            : null;

        return c.html(
            <Html class="debug | layout">
                <header>
                    <a href="/">Home</a>
                    <Show when={user} fallback={<a href="/signin">Sign in</a>}>
                        {(_) => <a href="/signout">Sign out</a>}
                    </Show>
                </header>
                <main class="wrapper">
                    <hgroup>
                        <h2>Deno 🦖 Htmx: Chat Application</h2>
                        <p>
                            Proof of concept real-time communication application
                        </p>
                    </hgroup>
                    <section>
                        <For each={Array.from({ length: 2 })}>
                            {($post) => <Card />}
                        </For>
                    </section>
                    <form>
                        <input
                            type="text"
                            name="message"
                            placeholder="Message"
                        />
                        <button type="submit" disabled>
                            send
                        </button>
                    </form>
                </main>
                <footer>
                    <small>footnote</small>
                </footer>
            </Html>
        );
    };
}

/**
 *  [stack-overflow](https://stackoverflow.com/questions/43953026/element-for-a-card-card-container-in-html5)
 *  [bookmark link](https://www.w3.org/TR/2016/REC-html51-20161101/links.html#link-type-bookmark)
 *  [avatar](https://codingforseo.com/blog/generate-gravatar/)
 */
function Card() {
    return (
        <article class="preview">
            <picture>
                <img
                    class="circle"
                    src={`https://www.gravatar.com/avatar/${toHashString(
                        hash
                    )}?d=retro`}
                    alt="gravatar"
                />
            </picture>
            <div>
                <div>
                    <p>Alice Bishop</p>
                    <p>{email}</p>
                </div>
                <div>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Expedita, molestiae.
                    </p>
                    <time datetime={datetime}>{datetime}</time>
                </div>
            </div>
        </article>
    );
}

const email = "alice@mail.com";
const enc = new TextEncoder().encode(email);
const hash = await crypto.subtle.digest("MD5", enc);
const datetime = new Date().toISOString().replace("T", " ").substring(0, 19);

/* DB HELPERS */

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
            JOIN sessions_users AS s ON u.id = s.user
            WHERE s.session = ?  
        `,
        args: [sessionId],
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
