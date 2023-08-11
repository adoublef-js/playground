import { Footer, Header, Html, SiteProps } from "./base/mod.ts";
import { Counter } from "./counter.tsx";

type DashboardProps = SiteProps;

export function Dashboard({ siteProps }: DashboardProps) {
    return (
        <Html {...siteProps}>
            <main>
                <h1>Hello, World</h1>
                <Counter value={0} href="/1" />
            </main>
        </Html>
    );
}
