import { MiddlewareHandler } from "$deps/hono.ts";
import { OAuth2Client } from "$deps/deno_kv_oauth.ts";

export function oauth<T extends IamEnv = IamEnv>(
    oauth2Client: OAuth2Client
): MiddlewareHandler<T> {
    return async (c, next) => {
        c.set("iam", oauth2Client);
        await next();
    };
}

export type IamEnv = {
    Variables: {
        iam: OAuth2Client;
    };
};
