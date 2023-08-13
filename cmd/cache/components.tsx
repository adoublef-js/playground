import { For, ForProps } from "$components/control/for.tsx";
import { Simplify } from "$deps/type-fest.ts";
import { Comment } from "./db.ts";

const HX_COMMENTS_CREATED = "comments-created";

type CommentFormProps = {
    article: string;
    href: {
        comments: string;
        formOptions: string;
    };
};

export function CommentForm({ article, href }: CommentFormProps) {
    return (
        <form hx-post={href.comments} hx-swap="outerHTML">
            <input type="hidden" name="article" value={article} />
            <select
                name="user"
                required
                hx-get={href.formOptions}
                hx-trigger="load"
                hx-swap="beforeend"
            >
                <option value="">Select a user</option>
            </select>
            <br />
            <input type="text" name="content" required />
            <br />
            <button type="submit">Add comment</button>
        </form>
    );
}

type ArticleCommentListProps = {
    href: string;
} & ForProps<Simplify<Omit<Comment, "article">>>;

export function ArticleCommentList({
    href,
    ...forProps
}: ArticleCommentListProps) {
    return (
        <section
            hx-swap="outerHTML"
            hx-get={href}
            hx-trigger={`${HX_COMMENTS_CREATED} from:body`}
        >
            <For {...forProps} />
        </section>
    );
}

type ArticleCommentProps = {
    comment: Simplify<Omit<Comment, "article">>;
    href: { user: string };
};

export function ArticleComment({ href, comment }: ArticleCommentProps) {
    return (
        <article>
            <a href={href.user}>
                <b>{`u/${comment.commentor}`}</b>
            </a>
            <p>{comment.content}</p>
        </article>
    );
}

type UserCommentListProps = {} & ForProps<Simplify<Omit<Comment, "commentor">>>;

export function UserCommentList({ ...forProps }: UserCommentListProps) {
    return (
        <section>
            <For {...forProps} />
        </section>
    );
}

type UserCommentProps = {
    comment: Simplify<Omit<Comment, "commentor">>;
    href: { article: string };
};

export function UserComment({ href, comment }: UserCommentProps) {
    return (
        <article>
            <a href={href.article}>
                <b>{comment.article}</b>
            </a>
            <p>{comment.content}</p>
        </article>
    );
}
