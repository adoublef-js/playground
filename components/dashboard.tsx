import { Footer, Header, Html, SiteProps } from "./base/mod.ts";

type DashboardProps = SiteProps;

export function Dashboard({ siteProps }: DashboardProps) {
    return (
        <Html {...siteProps}>
            <main>
                <h1>Hello, World</h1>
            </main>
        </Html>
    );
}
