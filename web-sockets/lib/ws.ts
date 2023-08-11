import { Input, Env, Context } from "$deps/hono.ts";

const { upgradeWebSocket } = Deno;

export function ws<
    T extends unknown = any,
    E extends Env = any,
    P extends string = any,
    I extends Input = Input
>(
    c: Context<E, P, I>,
    onmessage: (socket: WebSocket, data: T) => void,
    onclose?: (socket: WebSocket) => void
) {
    const { socket, response } = upgradeWebSocket(c.req.raw);

    // socket.onopen = () => console.log("socket opened");
    // socket.onerror = (e) => console.log("socket errored: ", e.message);
    if (onclose) socket.onclose = () => onclose(socket);

    socket.onmessage = (evt) => onmessage(socket, JSON.parse(evt.data));

    return response;
}
