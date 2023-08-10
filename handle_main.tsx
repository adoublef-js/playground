import { Handler } from "$deps/hono.ts";
import { Dashboard } from "./components/dashboard.tsx";

export function handleMain(): Handler {
    return ({ get, html }) => {
        return html(<Dashboard siteProps={{ title: "Welcome, Home 👋🏿" }} />);
    };
}
