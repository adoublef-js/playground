import { Hono } from "$deps/hono.ts";
import { serveStatic } from "https://deno.land/x/hono@v3.3.4/middleware.ts";
import { handleHtml as html } from "./handle_html.ts";

const app = new Hono();

app.get(
    "/",
    html`
        <!DOCTYPE html>
        <html>
            <link rel="stylesheet" href="/reset/joshw-comeau.css" />
            <link rel="stylesheet" href="/layouts/index.css" />
            <body id="root">
                <header>
                    <!-- header goes here -->
                </header>
                <main class="wrapper">
                    <h1>Hello!</h1>
                </main>
                <footer>
                    <!-- footer goes here -->
                </footer>
            </body>
        </html>
    `
);

app.use("/*", serveStatic({ root: "./static" }));

Deno.serve(app.fetch);
