import { Component, html, memo } from "$deps/hono.ts";

type HtmlProps = {
    title?: string;
    lang?: "en";
    children?: Component | Component[];
};

export const Html = memo(
    ({ children, title, lang = "en" }: HtmlProps) => html`
        <html>
            <head lang="${lang}">
                <meta
                    http-equiv="Content-Type"
                    content="text/html;charset=UTF-8"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>${title}</title>
                <script src="/htmx/@1.9.4/index.min.js"></script>
            </head>
            <body id="root">
                ${children}
            </body>
        </html>
    `
);

// NOTE include profile to siteProps
export type SiteProps<T extends Record<string, unknown> = {}> = {
    siteProps?: HtmlProps;
} & T;
