import { LibSqlClient } from "$deps/libsql.ts";
import { Ulid } from "$lib/id/ulid.ts";
import { Simplify } from "$deps/type-fest.ts";

export async function createComments(
    db: LibSqlClient,
    content: string,
    user: string,
    article: string
) {
    if (!content || !content.length) return null;

    const id = new Ulid();
    const rs = await db.execute({
        sql: `
        INSERT INTO comments (id, content, user, article)
        VALUES (?, ?, ?, ?)`,
        args: [new Ulid().toString(), content, user, article],
    });
    if (!rs.rowsAffected) return null;

    return id;
}

export async function listComments(
    db: LibSqlClient
): Promise<Simplify<Omit<Comment, "content">>[]> {
    const rs = await db.execute(`
        SELECT 
            c.id AS commentId
        ,   u.id AS commentor
        ,   a.id AS article
        FROM comments AS c
        INNER JOIN users AS u 
            ON u.id = c.user
        INNER JOIN articles AS a
            ON a.id = c.article
    `);

    return rs.rows.map((row) => {
        const [commentId, commentor, article] = Object.values(row);
        return {
            id: new Ulid(commentId?.toString()),
            commentor: String(commentor),
            article: String(article),
        };
    });
}

export async function getCommentsInfo(db: LibSqlClient, id: Ulid) {
    const rs = await db.execute({
        sql: `
        SElECT 
            c.id AS commentId
        ,   c.content AS content
        ,   u.id AS commentor
        ,   a.id AS article
        FROM comments AS c
        INNER JOIN users AS u 
            ON u.id = c.user
        INNER JOIN articles AS a
            ON a.id = c.article
        WHERE c.id = ?
        `,
        args: [id.toString()],
    });

    const row = rs.rows.at(0);
    if (!row) return null;

    const [commentId, content, commentor, article] = Object.values(row);
    return {
        id: new Ulid(commentId?.toString()),
        content: String(content),
        commentor: String(commentor),
        article: String(article),
    };
}

export type Comment = NonNullable<Awaited<ReturnType<typeof getCommentsInfo>>>;

export async function listCommentsByUser(
    db: LibSqlClient,
    user: string
): Promise<Simplify<Omit<Comment, "commentor">>[]> {
    const rs = await db.execute({
        sql: `
        SElECT 
            c.id AS commentId
        ,   c.content AS content
        ,   a.id AS article
        FROM comments AS c
        INNER JOIN articles AS a
            ON a.id = c.article
        WHERE c.user = ?
        `,
        args: [user],
    });

    return rs.rows.map((row) => {
        const [commentId, content, article] = Object.values(row);
        return {
            id: new Ulid(commentId?.toString()),
            content: String(content),
            article: String(article),
        };
    });
}

export async function listCommentsByArticle(
    db: LibSqlClient,
    article: string
): Promise<Simplify<Omit<Comment, "article">>[]> {
    const rs = await db.execute({
        sql: `
        SElECT 
            c.id AS commentId
        ,   c.content AS content
        ,   u.id AS commentor
        FROM comments AS c
        INNER JOIN users AS u
            ON u.id = c.user
        WHERE c.article = ?
        `,
        args: [article],
    });

    return rs.rows.map((row) => {
        const [commentId, content, commentor] = Object.values(row);
        return {
            id: new Ulid(commentId?.toString()),
            content: String(content),
            commentor: String(commentor),
        };
    });
}

export async function listUsers(db: LibSqlClient) {
    const rs = await db.execute(`
        SElECT 
            u.id AS user
        FROM users AS u
    `);

    return rs.rows.map((row) => {
        const [user] = Object.values(row);
        return {
            id: String(user),
        };
    });
}

export type User = Awaited<ReturnType<typeof listUsers>>[number];

/* 
export async function getAllComments(db: LibSqlClient) {
    const rs = await db.execute(`
        SELECT 
            c.id AS comment_id
        ,   c.content AS comment_content
        ,   u.id AS commentor_id
        ,   a.id AS article_id
        ,   a.content AS article_content
        ,   v.id AS author_id
        FROM comments AS c
        INNER JOIN users AS u 
            ON u.id = c.user
        INNER JOIN articles AS a
            ON a.id = c.article
        INNER JOIN users AS v
            ON v.id = a.user;
    `);

    console.log(rs.rows);
}
*/
