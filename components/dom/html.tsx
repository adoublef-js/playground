import { HtmlEscapedString, html, memo } from "$deps/hono.ts";

type HtmlProps = {
    title?: string;
    lang?: "en";
    children?: HtmlEscapedString | HtmlEscapedString[];
    class?: string;
};

const scripts = [
    { src: "/htmx/@1.9.4/index.min.js", defer: false, async: false },
    { src: "/htmx/@1.9.4/ws.js", defer: true, async: false },
    // "/static/htmx/@1.9.4/sse.js",
    // "/static/hyperscript/@0.9.11/index.min.js"
];

const styles = [
    "/css/resets/elly-loel.css",
    "/css/@0.0.1/debug.css",
    "/css/@0.0.1/index.css",
];

export const Html = memo(
    ({ children, title, ["class"]: className, lang = "en" }: HtmlProps) => html`
        <html>
            <head lang="${lang}">
                <meta content="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>${title}</title>
                <!-- links to styles -->
                ${styles.map(
                    (href) => html`
                        <link rel="preload" href="${href}" as="style" />
                        <link rel="stylesheet" href="${href}" />
                    `
                )}
                <!-- scripts -->
                ${scripts.map(({ src, defer, async }) => {
                    if (defer) {
                        return html`
                            <link rel="preload" href="${src}" as="script" />
                            <script src="${src}" defer></script>
                        `;
                    }

                    if (async) {
                        return html`
                            <link rel="preload" href="${src}" as="script" />
                            <script src="${src}" async></script>
                        `;
                    }

                    return html`<script src="${src}"></script>`;
                })}
            </head>
            <body class="${className}">
                ${children}
            </body>
        </html>
    `
);

// NOTE include profile to siteProps
export type SiteProps<T extends Record<string, unknown> = {}> = {
    siteProps?: HtmlProps;
} & T;
