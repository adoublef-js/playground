import { HtmlEscapedString, html } from "$deps/hono.ts";

export function Show<T>({ when, fallback, children }: ShowProps<T>) {
    if (!when) return fallback || html``;
    return typeof children === "function" ? children(when) : children;
}

type ShowProps<T> = {
    when?: T;
    fallback?: HtmlEscapedString;
    children: HtmlEscapedString | ((item: T) => HtmlEscapedString);
};
