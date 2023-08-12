/* [tagName cheatsheet](https://www.semrush.com/blog/html-tags-list/) */
import { Hono, serveStatic } from "$deps/hono.ts";
import { Html } from "$components/base/html.tsx";
import { crypto, toHashString } from "$deps/std/crypto.ts";
import {
    signIn,
    handleCallback,
    signOut,
    createGoogleOAuth2Client,
    getSessionAccessToken,
    getSessionId,
} from "$deps/deno_kv_oauth.ts";

const oauth2Client = createGoogleOAuth2Client({
    redirectUri: "http://localhost:8000/callback",
    defaults: {
        scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ],
    },
});

// https://accounts.google.com/.well-known/openid-configuration

if (import.meta.main) {
    const app = new Hono();

    app.get("/", async (c) => {
        const sessionId = getSessionId(c.req.raw);
        const isSignedIn = sessionId !== undefined;
        const accessToken = isSignedIn
            ? await getSessionAccessToken(oauth2Client, sessionId)
            : null;
        const userInfo = accessToken
            ? await getGoogleUserInfo(accessToken)
            : null;

        return c.html(
            <Html class="debug | layout">
                <header>
                    <a href="/">home</a>
                    <a href="/signin">signin</a>
                    <a href="/signout">signout</a>
                </header>
                <main class="wrapper">
                    <hgroup>
                        <h2>Deno 🦖 Htmx: Chat Application</h2>
                        <p>
                            Proof of concept real-time communication application
                        </p>
                    </hgroup>
                    {userInfo ? (
                        <article>
                            <picture>
                                <img src={userInfo.picture} alt="gravatar" />
                            </picture>
                        </article>
                    ) : null}
                    <section>
                        {Array.from({ length: 5 }).map(($post) => (
                            <Card />
                        ))}
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
    });

    app.get("/signin", async (c) => {
        const response = await signIn(c.req.raw, oauth2Client, {
            urlParams: {
                access_type: "offline",
                include_granted_scopes: true.toString(),
                prompt: "select_account",
            },
        });

        c.header("set-cookie", response.headers.get("set-cookie")!);
        return c.redirect(response.headers.get("location")!, response.status);
    });

    app.get("/callback", async (c) => {
        const { response } = await handleCallback(c.req.raw, oauth2Client);

        c.header("set-cookie", response.headers.get("set-cookie")!);
        return c.redirect(response.headers.get("location")!, response.status);
    });

    app.get("/signout", async (c) => {
        const response = await signOut(c.req.raw); //, logoutUrl.toString());

        c.header("set-cookie", response.headers.get("set-cookie")!);
        return c.redirect(response.headers.get("location")!, response.status);
    });

    app.use("/*", serveStatic({ root: "./static/" }));

    Deno.serve(app.fetch);
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

async function getGoogleUserInfo(accessToken: string) {
    const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return userInfo.json() as Promise<JWTPayload>;
}

/* TODO revokeAccessToken() */

type JWTPayload = {
    sub: string;
    name: string;
    picture?: string;
    email: string;
    locale: string;
};
