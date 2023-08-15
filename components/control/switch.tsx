import { HtmlEscapedString, html } from "$deps/hono.ts";

/** [TODO](https://www.solidjs.com/docs/latest/api#switchmatch) */
export function Switch<T>({
    fallback,
    children,
}: SwitchProps): HtmlEscapedString {
    // return;
}

type SwitchProps = {
    fallback?: HtmlEscapedString;
    children: HtmlEscapedString;
};

export function Match<T>(props: MatchProps<T>) {}

type MatchProps<T> = {
    when?: T;
    fallback?: HtmlEscapedString;
    children: HtmlEscapedString | ((item: T) => HtmlEscapedString);
};
