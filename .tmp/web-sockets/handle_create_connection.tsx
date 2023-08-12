import { Handler, html } from "$deps/hono.ts";
import { ReplyForm } from "./components/reply-form.tsx";

export function handleCreateConnection(): Handler {
    return (c) => {
        const params = new URLSearchParams();
        params.set("username", c.req.headers.get("hx-prompt") || "Anonymous");

        return c.html(
            <section hx-ext="ws" ws-connect={`/chat?${params.toString()}`}>
                <output id="messages">{/* will populate  */}</output>

                <ReplyForm id="form" autofocus />
            </section>
        );
    };
}
