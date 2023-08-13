import { Env, Handler } from "$deps/hono.ts";
import { Status } from "$deps/std/http.ts";
import { Ulid } from "$lib/id/ulid.ts";
import { Html } from "$components/dom/html.tsx";
import {
    Comment,
    createComments,
    listComments,
    getCommentsInfo,
    listCommentsByUser,
    listCommentsByArticle,
    listUsers,
} from "./db.ts";
import { TursoEnv } from "./middleware.ts";
import { For } from "$components/control/for.tsx";
import {
    ArticleCommentList,
    CommentForm,
    UserComment,
    UserCommentList,
} from "./components.tsx";

const HX_COMMENTS_CREATED = "comments-created";

export function handleListComments<
    T extends TursoEnv = TursoEnv
>(): Handler<T> {
    const hateoas = ({ id, ...content }: Omit<Comment, "content">) => ({
        ...content,
        id: id.toString(),
    });

    return async ({ req, get, json, html }) => {
        const comments = await listComments(get("db"));

        return html(
            <ul>
                <For each={comments.map(hateoas)}>
                    {(comment) => (
                        <div>
                            <a href={`/users/${comment.commentor}`}>
                                {`u/${comment.commentor}`}
                            </a>
                            <p>
                                See more comments on the article{" "}
                                <a href={`/articles/${comment.article}`}>
                                    here
                                </a>
                            </p>
                        </div>
                    )}
                </For>
            </ul>
        );
    };
}

export function handleGetCommentsById<T extends TursoEnv = TursoEnv>(): Handler<
    T,
    "/comments/:id"
> {
    const mapFn = ({ id, ...content }: Comment) => ({
        ...content,
        id: id.toString(),
    });

    return async ({ req, get, text, json }) => {
        const id = new Ulid(req.param("id"));

        const found = await getCommentsInfo(get("db"), id);
        if (!found) return text("Comment not found", Status.NotFound);

        return json(mapFn(found));
    };
}

export function handleFormOptions<T extends TursoEnv = TursoEnv>(): Handler<T> {
    return async ({ get, html }) => {
        const [db] = [get("db")];
        const [users] = await Promise.all([listUsers(db)]);

        return html(
            <For each={users}>
                {(user) => <option value={user.id}>{user.id}</option>}
            </For>
        );
    };
}

export function handleCreateComments<
    T extends TursoEnv = TursoEnv
>(): Handler<T> {
    return async ({ req, get, header, text, html }) => {
        const { content, user, article } = await req.parseBody();
        const id = await createComments(
            get("db"),
            content as string,
            user as string,
            article as string
        );

        if (!id) return text("Unable to create comment", 500);

        header("location", `/comments/${id?.toString()}`);
        header("hx-trigger", HX_COMMENTS_CREATED);
        return html(
            <CommentForm
                article={article as string}
                href={{ comments: "/comments", formOptions: "/forms" }}
            />
        );
    };
}

export function handleDeleteCommentsById<
    T extends TursoEnv = TursoEnv
>(): Handler<T> {
    return ({ req, get, text }) => {
        return text("todo", Status.NotImplemented);
    };
}

export function handleListCommentsByUser<
    T extends TursoEnv = TursoEnv
>(): Handler<T, "/users/:id/comments"> {
    const mapFn = ({ id, ...content }: Omit<Comment, "commentor">) => ({
        ...content,
        id: id.toString(),
    });

    return async ({ req, get, json }) => {
        const user = req.param("id");
        const comments = await listCommentsByUser(get("db"), user);

        return json(comments.map(mapFn));
    };
}

export function handleListCommentsByArticle<
    T extends TursoEnv = TursoEnv
>(): Handler<T, "/articles/:id/comments"> {
    const mapFn = ({ id, ...content }: Omit<Comment, "article">) => ({
        ...content,
        id: id.toString(),
    });

    return async ({ req, get, json, html }) => {
        const [db, article] = [get("db"), req.param("id")];
        const comments = await listCommentsByArticle(db, article);

        console.log(comments.length);

        return html(
            <ArticleCommentList
                each={comments}
                href={`/articles/${article}/comments`}
            >
                {(comment) => (
                    <div>
                        <a href={`/users/${comment.commentor}`}>
                            <b>{`u/${comment.commentor}`}</b>
                        </a>
                        <p>{comment.content}</p>
                    </div>
                )}
            </ArticleCommentList>
        );
    };
}

export function handleHomePage(): Handler {
    return ({ html }) => {
        return html(
            <Html>
                <main>
                    <hgroup>
                        <h1>Comments</h1>
                    </hgroup>
                    <section>
                        <p>List comments</p>
                        <ul
                            hx-trigger="load"
                            hx-get="/comments"
                            hx-swap="outerHTML"
                        ></ul>
                    </section>
                </main>
            </Html>
        );
    };
}

export function handleUserPage(): Handler<TursoEnv, "/users/:id"> {
    return async ({ req, get, html }) => {
        const [db, user] = [get("db"), req.param("id")];
        const comments = await listCommentsByUser(db, user);

        return html(
            <Html>
                <main>
                    <hgroup>
                        <h1>Comments by {`u/${user}`}</h1>
                    </hgroup>
                    <UserCommentList each={comments}>
                        {(comment) => (
                            <UserComment
                                comment={comment}
                                href={{
                                    article: `/articles/${comment.article}`,
                                }}
                            />
                        )}
                    </UserCommentList>
                </main>
            </Html>
        );
    };
}

export function handleArticlePage(): Handler<TursoEnv, "/articles/:id"> {
    return async ({ req, get, html }) => {
        const [db, article] = [get("db"), req.param("id")];
        // const info = await getArticlesInfo(db, article)
        const [users, comments] = await Promise.all([
            listUsers(db),
            listCommentsByArticle(db, article),
        ]);

        return html(
            <Html>
                <main>
                    <hgroup>
                        <h1>{article}</h1>
                        {/* <a href=""></a> */}
                    </hgroup>
                    <CommentForm
                        article={article}
                        href={{ comments: "/comments", formOptions: "/forms" }}
                    />
                    <ArticleCommentList
                        each={comments}
                        href={`/articles/${article}/comments`}
                    >
                        {(comment) => (
                            <div>
                                <a href={`/users/${comment.commentor}`}>
                                    <b>{`u/${comment.commentor}`}</b>
                                </a>
                                <p>{comment.content}</p>
                            </div>
                        )}
                    </ArticleCommentList>
                </main>
            </Html>
        );
    };
}
