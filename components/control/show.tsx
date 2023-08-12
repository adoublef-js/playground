import { HtmlEscapedString, html } from "$deps/hono.ts";

/** [TODO](https://www.solidjs.com/docs/latest/api#show) */
export function Show<T>({ when, fallback, children }: ShowProps<T>):HtmlEscapedString {
    if (!when) return fallback || html``;
    return typeof children === "function" ? children(when) : children;
}

type ShowProps<T> = {
    when?: T;
    fallback?: HtmlEscapedString;
    children: HtmlEscapedString | ((item: T) => HtmlEscapedString);
};
