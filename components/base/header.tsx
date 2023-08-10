import { memo } from "$deps/hono.ts";

type HeaderProps = {};

export const Header = memo((props: HeaderProps) => (
    <header>
        <li>
            <a href="https://coffeesaurus.deno.dev">
                <small>🦖</small>
            </a>
        </li>
    </header>
));
