import { Handler } from "$deps/cheetah.ts";
import { signOut } from "$deps/deno_kv_oauth.ts";
import { logoutUrl } from "./oauth_client.ts";

export function handleSignout(): Handler<unknown> {
    return async (c) => {
        const response = await signOut(c.req.raw, logoutUrl.toString());

        c.res.header("set-cookie", response.headers.getSetCookie()[0]);
        return c.res.redirect(response.headers.get("location")!);
    };
}
