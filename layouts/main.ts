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
            <link rel="stylesheet" href="/debug.css" />
            <link rel="stylesheet" href="/layouts/index.css" />
            <body id="root" class="debug">
                <header>
                    <!-- header goes here -->
                </header>
                <main class="wrapper sidebar">
                    <section>
                        <h1>Hello!</h1>
                        <p>This is a paragraph</p>

                        <!-- horizontal scroll (reel) -->

                        <!-- consistent form -->
                        <form>
                            <label>
                                <span>email</span>
                                <input type="text" />
                            </label>
                            <label>
                                <span>email</span>
                                <input type="text" />
                            </label>
                            <label>
                                <span>email</span>
                                <input type="text" />
                            </label>
                            <button disabled>submit</button>
                        </form>
                    </section>
                    <aside>
                        <!-- aside -->
                        <ul>
                            <li>
                                <a href="#">foo</a>
                            </li>
                            <li>
                                <a href="#">bar</a>
                            </li>
                            <li>
                                <a href="#">baz</a>
                            </li>
                        </ul>
                    </aside>
                </main>
                <footer>
                    <!-- footer goes here -->
                    <small>Powered by Hono</small>
                </footer>
            </body>
        </html>
    `
);

app.use("/*", serveStatic({ root: "./static" }));

Deno.serve(app.fetch);
