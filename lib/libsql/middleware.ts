import { MiddlewareHandler } from "$deps/hono.ts";
import { LibSqlClient } from "$deps/libsql.ts";

export function libsql<T extends LibSqlEnv = LibSqlEnv>(
    libsqlClient: LibSqlClient
): MiddlewareHandler<T> {
    return async (c, next) => {
        c.set("dao", libsqlClient);
        await next();
    };
}

export type LibSqlEnv = {
    Variables: {
        dao: LibSqlClient;
    };
};
