/** @jsx h */
import { h, jsx, Handler } from "$deps/cheetah.ts";
import { getSessionAccessToken, getSessionId } from "$deps/deno_kv_oauth.ts";
import { Dashboard } from "./components/dashboard.tsx";
import { Home } from "./components/home.tsx";
import { oauthClient } from "./iam/oauth_client.ts";

export function handleHome(): Handler<unknown> {
    return async (c) => {
        const sessionId = getSessionId(c.req.raw);
        const isSignedIn = sessionId !== undefined; // (404)
        const accessToken = isSignedIn
            ? await getSessionAccessToken(oauthClient, sessionId) // (401)
            : null;

        if (!accessToken) {
            return jsx(c, <Home />);
        }

        return jsx(c, <Dashboard />);
    };
}
