import { Handler } from "$deps/hono.ts";
import { handleCallback as hc } from "$deps/deno_kv_oauth.ts";
import { IamEnv } from "./middleware.ts";
import { getGoogleUser } from "./get_google_user.ts";
import { LibSqlEnv } from "$lib/libsql/middleware.ts";
import { createUser } from "./create_user.ts";
import { createUserSession } from "./create_user_session.ts";
import { getUser } from "./get_user.ts";

/** [TODO](https://github.com/denoland/saaskit/blob/main/routes/callback.ts) */
export function handleCallback<
    T extends IamEnv & LibSqlEnv = IamEnv & LibSqlEnv
>(): Handler<T> {
    return async ({ req, get, header, redirect }) => {
        const { response, accessToken, sessionId } = await hc(
            req.raw,
            get("iam")
        );
        // FIXME error handling
        const googleUser = await getGoogleUser(accessToken);

        const user = await getUser(get("dao"), googleUser.email);
        /* use a throw instead */
        if (!user) {
            const user = {
                username: googleUser.name,
                email: googleUser.email,
                photoUrl: googleUser.picture,
            };

            const _ = await createUser(get("dao"), user, sessionId);
        } else {
            // set sessions from database
            const _ = await createUserSession(get("dao"), user, sessionId);
        }

        header("set-cookie", response.headers.get("set-cookie")!);
        return redirect(response.headers.get("location")!, response.status);
    };
}



