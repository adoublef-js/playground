import { Handler, html as h } from "$deps/hono.ts";

export function handleHtml(
    strings: TemplateStringsArray,
    ...values: unknown[]
): Handler {
    return (c) => c.html(h(strings, ...values));
}
