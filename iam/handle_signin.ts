import { Handler } from "$deps/hono.ts";
import { signIn } from "$deps/deno_kv_oauth.ts";
import { IamEnv } from "./middleware.ts";

/** [TODO](https://github.com/denoland/saaskit/blob/main/routes/signin.ts) */
export function handleSignIn(): Handler<IamEnv> {
    const urlParams = {
        access_type: "offline",
        include_granted_scopes: true.toString(),
        prompt: "select_account",
    };

    return async (c) => {
        /* no sessionId then return undefined */
        const response = await signIn(c.req.raw, c.get("iam"), {
            urlParams,
        });

        c.header("set-cookie", response.headers.get("set-cookie")!);
        return c.redirect(response.headers.get("location")!, response.status);
    };
}
