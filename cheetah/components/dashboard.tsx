/** @jsx h */
import { h } from "$deps/mod.ts";

type DashboardProps = {};

export function Dashboard(props: DashboardProps) {
    return (
        <main>
            <header>
                <h1>Welcome, back!</h1>
            </header>
            <p>
                <a href="/signout">Sign out</a>
            </p>
            <p>
                <a href="https://github.com/adoublef-js/playground/blob/main/cheetah/main.tsx">
                    Source code
                </a>
            </p>
        </main>
    );
}
