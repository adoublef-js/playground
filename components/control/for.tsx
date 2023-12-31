import { HtmlEscapedString, html } from "$deps/hono.ts";

/** [TODO](https://www.solidjs.com/docs/latest/api#for) */
export function For<T, U extends HtmlEscapedString>({
    each,
    fallback,
    children,
}: ForProps<T, U>): HtmlEscapedString {
    if (!each.length) return fallback || html``;
    return html`${each.map(children)}`;
}

export type ForProps<T, U extends HtmlEscapedString = HtmlEscapedString> = {
    each: readonly T[];
    fallback?: HtmlEscapedString;
    children: (item: T, index: number) => U;
};
