import { HtmlEscapedString } from "$deps/hono.ts";

type MessageCardProps = {
    parent: string;
    children?: HtmlEscapedString | HtmlEscapedString[];
};

export function MessageCard({ parent, children }: MessageCardProps) {
    return <div hx-swap-oob={`beforeend:#${parent}`}>{children}</div>;
}
