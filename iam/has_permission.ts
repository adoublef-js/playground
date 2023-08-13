import { LibSqlClient } from "$deps/libsql.ts";

/** [TODO](https://blog.warrant.dev/implementing-role-based-access-control/#querying-permissions) */
export async function hasPermission(c: LibSqlClient, permission: string) {
    const rs = await c.execute({
        sql: `
        SELECT *
        FROM permissions AS p
        INNER JOIN roles_permissions AS rp
            ON p.id = rp.permission
        WHERE
            p.id = :permission AND
            rp.role IN (
                SELECT id
                FROM roles AS r
                WHERE user = :user
            )
        `,
        args: { permission, user: "__user" },
    });

    return rs.rows.length !== 0;
}
