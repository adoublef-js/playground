import { Handler } from "$deps/hono.ts";
import { Html } from "$components/dom/html.tsx";
import { Form, TextArea, TextField } from "./components.tsx";
import { minLength, object, string } from "$deps/valibot.ts";
import { parse } from "./parse.ts";

export function handleHomePage(): Handler {
    return ({ html }) => {
        return html(
            <Html class="layout">
                <main class="wrapper">
                    <h1>Form input</h1>
                    <Form action="/" method="post" class="form">
                        <TextField
                            label="Foo"
                            htmlFor="foo"
                            placeholder="Enter value for Foo"
                            class="form-group"
                        />
                        <TextField
                            label="Bar"
                            htmlFor="bar"
                            placeholder="Enter value for Bar"
                            class="form-group"
                        />
                        <TextArea
                            label="Baz"
                            htmlFor="baz"
                            placeholder="Enter value for baz"
                            class="form-group form-group--full"
                        />
                    </Form>
                </main>
            </Html>
        );
    };
}

function not<T, E>(when: E | boolean | true, callback: () => T): T | undefined {
    return !when ? callback() : undefined;
}

export function handleFormSubmit(): Handler {
    const schema = object({
        foo: string([minLength(3)]),
        bar: string([minLength(5)]),
        baz: string(),
    });

    return async ({ req, html }) => {
        const [formData, formError] = parse(schema, await req.parseBody());

        const rs = await not(formError, () => doSomething(formData));

        // set location header with the location of this resource
        return html(
            <Form action="/" method="post" class="form">
                <TextField
                    label="Foo"
                    htmlFor="foo"
                    placeholder="Enter value for Foo"
                    value={formData.foo}
                    error={formError?.foo}
                    reset={rs}
                    class="form-group"
                />
                <TextField
                    label="Bar"
                    htmlFor="bar"
                    placeholder="Enter value for Bar"
                    value={formData.bar}
                    error={formError?.bar}
                    reset={rs}
                    class="form-group"
                />
                <TextArea
                    label="Baz"
                    htmlFor="baz"
                    placeholder="Enter value for baz"
                    value={formData.baz}
                    error={formError?.baz}
                    reset={rs}
                    class="form-group form-group--full"
                />
            </Form>
        );
    };
}

// deno-lint-ignore require-await
async function doSomething(_: { foo: string }): Promise<number | undefined> {
    return 1;
}
