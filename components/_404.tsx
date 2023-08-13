import { Html, SiteProps } from "$components/dom/html.tsx";

type NotFoundProps = SiteProps;

export function NotFound({ siteProps }: NotFoundProps) {
    return (
        <Html {...siteProps}>
            <main>
                <p>There was an error in your request 🥹</p>
            </main>
        </Html>
    );
}
