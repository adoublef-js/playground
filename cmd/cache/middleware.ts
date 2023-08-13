import { LibSqlClient } from "$deps/libsql.ts";
import { Env, MiddlewareHandler } from "$deps/hono.ts";

export function turso<E extends TursoEnv = TursoEnv>(
    db: LibSqlClient
): MiddlewareHandler<E> {
    return async ({ set }, next) => {
        set("db", db);
        await next();
    };
}

export type TursoEnv = {
    Variables: {
        db: LibSqlClient;
    };
};
