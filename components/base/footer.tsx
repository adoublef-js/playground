import { memo } from "$deps/hono.ts";
import { GitHub, Deno } from "./svg/mod.ts";

type FooterProps = {};

export const Footer = memo((props: FooterProps) => (
    <footer>
        <small>Powered by Hono</small>
        <ul class="list-hidden">
            <li>
                <a href="https://github.com/adoublef-js/coffeesaurus">
                    <GitHub class="logo github" />
                </a>
            </li>
            <li>
                <a href="https://deno.land/">
                    <Deno class="logo deno" />
                </a>
            </li>
        </ul>
    </footer>
));
