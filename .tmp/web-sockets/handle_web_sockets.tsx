import { HTTPException, Handler, html } from "$deps/hono.ts";
import { Status } from "$deps/std/http.ts";
import { MessageCard } from "./components/message-card.tsx";
import { ReplyForm } from "./components/reply-form.tsx";
import { ws } from "./lib/ws.ts";

const clients = new Map<string, WebSocket>();

function broadcast(message: string) {
    for (const client of clients.values()) {
        client.send(message);
    }
}

export function handleWebSockets(): Handler {
    return (c) => {
        const username = c.req.query("username")!;

        if (clients.has(username)) {
            throw new HTTPException(Status.Conflict, {
                message: `Client ${username} already exists`,
            });
        }

        return ws<{ message: string }>(
            c,
            (socket, { message }) => {
                clients.set(username, socket);

                return broadcast(
                    html`
                        ${(
                            <MessageCard parent="messages">
                                <p>
                                    <b>{username}</b>: {message}
                                </p>
                            </MessageCard>
                        )}
                        ${(
                            <ReplyForm
                                id="form"
                                hx-swap-oob="outerHTML:#form"
                                autofocus
                            />
                        )}
                    `
                );
            },
            (socket) => {
                console.log(`Client ${username} disconnected`);
                clients.delete(username);
            }
        );
    };
}
