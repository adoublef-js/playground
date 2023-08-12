import { Handler } from "$deps/hono.ts";
import { Html } from "$components/base/html.tsx";

export function handleMain(): Handler {
    return (c) => {
        return c.html(
            <Html>
                <header>
                    <h1>Server-Sent Events</h1>
                </header>
                <main>
                    <p>
                        This example will show case how the server can send
                        notifications to the user when an update to the system
                        occurs.
                    </p>
                    <p>
                        To demonstrate this, open the application in two
                        different tabs. When you send a message from one window,
                        it should show on the other window
                    </p>
                </main>
            </Html>
        );
    };
}
