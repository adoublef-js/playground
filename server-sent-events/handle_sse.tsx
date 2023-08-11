import { Handler } from "$deps/hono.ts";

export function handleSse(): Handler {
    return (c) => c.text("sse");
}
