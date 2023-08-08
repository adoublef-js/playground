/** @jsx h */
import { h, jsx } from "https://deno.land/x/cheetah@v1.1.0/x/jsx.tsx";
import cheetah from "https://deno.land/x/cheetah@v1.1.0/mod.ts";
import {
    getSessionId,
    getSessionAccessToken,
    createAuth0OAuth2Client,
    handleCallback,
    signIn,
    signOut,
} from "../deps/mod.ts";

const oauthClient = createAuth0OAuth2Client({
    redirectUri: "http://localhost:8000/callback",
    defaults: {
        scope: "openid profile",
    },
});

const params = new URLSearchParams();
params.append("returnTo", new URL(oauthClient.config.redirectUri!).origin);
params.append("client_id", oauthClient.config.clientId);

const logoutUrl = new URL(
    `v2/logout?${params}`,
    new URL(oauthClient.config.authorizationEndpointUri).origin
);

const app = new cheetah();

function Custom(props: { isSignedIn: boolean; accessToken: string | null }) {
    const accessTokenInnerText =
        props.accessToken !== null ? (
            <div>
                {" "}
                <span style="filter:blur(3px)">${props.accessToken}</span>{" "}
                (intentionally blurred for security)
            </div>
        ) : (
            props.accessToken
        );

    return (
        <main>
            <p>Provider: Auth0</p>
            <p>Signed in: {props.isSignedIn.toString()}</p>
            <p>Your access token: {accessTokenInnerText}</p>
            <p>
                <a href="/signin">Sign in</a>
            </p>
            <p>
                <a href="/signout">Sign out</a>
            </p>
            <p>
                <a href="https://dash.deno.com/playground/oak-deno-kv-oauth-demo">
                    Source code
                </a>
            </p>
        </main>
    );
}

app.get("/", async (c) => {
    const sessionId = getSessionId(c.req.raw); //await getSessionAccessToken(oauth2Client);
    const isSignedIn = sessionId !== undefined;
    const accessToken = isSignedIn
        ? await getSessionAccessToken(oauthClient, sessionId)
        : null;

    return jsx(c, <Custom isSignedIn={isSignedIn} accessToken={accessToken} />);
});

app.get("/signin", async (c) => {
    const response = await signIn(c.req.raw, oauthClient);

    c.res.header("set-cookie", response.headers.getSetCookie()[0]);
    return c.res.redirect(response.headers.get("location")!);
});

app.get("/callback", async (c) => {
    const { response } = await handleCallback(c.req.raw, oauthClient);

    c.res.header("set-cookie", response.headers.getSetCookie()[0]);
    return c.res.redirect(response.headers.get("location")!);
});

app.get("/signout", async (c) => {
    const response = await signOut(c.req.raw, logoutUrl.toString());

    c.res.header("set-cookie", response.headers.getSetCookie()[0]);
    return c.res.redirect(response.headers.get("location")!);
});

app.serve();
