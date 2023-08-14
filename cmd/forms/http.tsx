import { Handler } from "$deps/hono.ts";
import { Html } from "$components/dom/html.tsx";
import { Form, Input } from "./components.tsx";
import {
    minLength,
    object,
    string,
} from "https://deno.land/x/valibot@v0.12.0/mod.ts";
import { parse } from "./parse.ts";

export function handleHomePage(): Handler {
    return ({ html }) => {
        return html(
            <Html>
                <main>
                    <h1>Form input</h1>
                    <Form action="/" method="post">
                        <Input
                            label="Foo"
                            htmlFor="foo"
                            placeholder="Enter value for Foo"
                        />
                        <Input
                            label="Bar"
                            htmlFor="bar"
                            placeholder="Enter value for Bar"
                        />
                    </Form>
                </main>
            </Html>
        );
    };
}

export function handleFormSubmit(): Handler {
    return async ({ req, html, status }) => {
        const [formData, formError] = parse(
            object({
                foo: string([minLength(3)]),
                bar: string([minLength(5)]),
            }),
            await req.parseBody()
        );

        const rs = !formError ? await doSomething(formData) : null;

        // set location header with the location of this resource
        return html(
            <Form action="/" method="post">
                <Input
                    label="Foo"
                    htmlFor="foo"
                    placeholder="Enter value for Foo"
                    value={formData.foo}
                    error={formError?.foo}
                    reset={!formError}
                />
                <Input
                    label="Bar"
                    htmlFor="bar"
                    placeholder="Enter value for Bar"
                    value={formData.bar}
                    error={formError?.bar}
                    reset={!formError}
                />
            </Form>
        );
    };
}

// deno-lint-ignore require-await
async function doSomething(props: { foo: string }): Promise<number | null> {
    return 0;
}
