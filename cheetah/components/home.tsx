/** @jsx h */
import { h } from "$deps/mod.ts";

type HomeProps = {};

export function Home(props: HomeProps) {
    return (
        <main>
            <header>
                <h1>Please, Login</h1>
            </header>
            <p>
                <a href="/signin">Sign in</a>
            </p>
            <p>
                <a href="https://github.com/adoublef-js/playground/blob/main/cheetah/main.tsx">
                    Source code
                </a>
            </p>
        </main>
    );
}
