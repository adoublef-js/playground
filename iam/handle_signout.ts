import { Handler } from "$deps/hono.ts";
import { getSessionId, signOut } from "$deps/deno_kv_oauth.ts";
import { LibSqlEnv } from "$lib/libsql/middleware.ts";

/** [TODO](https://github.com/denoland/saaskit/blob/main/routes/signout.ts) */
export function handleSignOut<T extends LibSqlEnv = LibSqlEnv>(): Handler<T> {
    return async ({ req, header, redirect }) => {
        const sessionId = getSessionId(req.raw);
        if (sessionId) {
            // await deleteSessionByUser()
        }

        const response = await signOut(req.raw); //, logoutUrl.toString());

        header("set-cookie", response.headers.get("set-cookie")!);
        return redirect(response.headers.get("location")!, response.status);
    };
}
