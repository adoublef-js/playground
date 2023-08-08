import { Handler } from "$deps/cheetah.ts";
import { signIn } from "$deps/deno_kv_oauth.ts";
import { oauthClient } from "./oauth_client.ts";

export function handleSignin(): Handler<unknown> {
    return async (c) => {
        const response = await signIn(c.req.raw, oauthClient);

        c.res.header("set-cookie", response.headers.getSetCookie()[0]);
        return c.res.redirect(response.headers.get("location")!);
    };
}
