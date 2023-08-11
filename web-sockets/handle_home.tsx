import { Handler } from "$deps/hono.ts";
import { Html } from "$components/base/html.tsx";

export function handleMain(): Handler {
    return (c) => {
        return c.html(
            <Html>
                <header>
                    <h1>Web sockets</h1>
                </header>
                <main>
                    <section>
                        <p>
                            This example will show case how a simple web-socket
                            server can be created using Deno, Hono & Htmx.
                        </p>
                        <p>
                            To demonstrate this, open the application in two
                            different tabs. When you send a message from one
                            window, it should show on the other window.
                        </p>
                    </section>
                    <button
                        hx-get="/connect"
                        hx-swap="outerHTML"
                        hx-prompt="Enter your username"
                    >
                        connect
                    </button>
                </main>
            </Html>
        );
    };
}
