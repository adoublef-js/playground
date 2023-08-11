import { Context, HTTPException, Handler, html } from "$deps/hono.ts";
import { Counter } from "$components/counter.tsx";
import { Html } from "$components/base/mod.ts";
import { Request, Status, accepts } from "$deps/std/http.ts";

const Message = () => <div>hello</div>;

// https://deno.com/blog/deploy-streams
// https://htmx.org/attributes/hx-sse/
export function handleSse(): Handler<any, "/sse"> {
    return (c) => {
        let timerId: number | undefined;
        let count = 0;
        const body = new ReadableStream({
            start(controller) {
                timerId = setInterval(() => {
                    controller.enqueue(
                        new TextEncoder().encode(
                            `data: ${html`<div>hello: ${count++}</div>`}\n\n`
                        )
                    );
                }, 1000);
            },
            cancel() {
                if (typeof timerId === "number") {
                    clearInterval(timerId);
                }
            },
        });

        return new Response(body, {
            headers: {
                "Content-Type": "text/event-stream",
            },
        });
    };
}
