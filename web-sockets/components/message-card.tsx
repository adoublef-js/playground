import { Component } from "$deps/hono.ts";

type MessageCardProps = {
    parent: string;
    children?: Component | Component[];
};

export function MessageCard({ parent, children }: MessageCardProps) {
    return <div hx-swap-oob={`beforeend:#${parent}`}>{children}</div>;
}
