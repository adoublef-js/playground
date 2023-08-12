import { Context, HTTPException, Handler } from "$deps/hono.ts";
import { Counter } from "$components/counter.tsx";
import { Html } from "$components/base/mod.ts";
import { Request, Status, accepts } from "$deps/std/http.ts";

export function handleMain(): Handler<any, "/:count{[0-9]+}?"> {
    return async (c) => {
        /* parse user input */
        const { value, accept, isHtmx } = await parseRequest(c);

        /* do something */
        const nextValue = await doSomething(value);

        /* map domain entity to hateoas object */
        const entity = {
            value,
            _links: {
                self: {
                    method: "GET",
                    href: new URL(c.req.url).origin + `/${value}`,
                },
                increment: {
                    method: "GET",
                    href: new URL(c.req.url).origin + `/${nextValue}`,
                },
            },
        };

        /* write response */
        if (isHtmx) {
            return c.html(
                <Counter
                    value={entity.value}
                    href={entity._links.increment.href}
                />,
                200,
                { "HX-Push-Url": entity._links.self.href }
            );
        }

        if (accept === "*/*") {
            return c.json(entity);
        }

        if (!(accept === "text/html")) {
            throw new HTTPException(Status.BadRequest);
        }

        return c.html(
            <Html title="Welcome, Home 👋🏿">
                <main>
                    <h1>Hello, World</h1>
                    <Counter
                        value={entity.value}
                        href={entity._links.increment.href}
                    />
                    <section>
                        {/* listen to sse */}
                        <div hx-ext="sse" sse-connect="/sse">
                            <div sse-swap="message" hx-swap="beforeend"></div>
                        </div>
                    </section>
                </main>
            </Html>
        );
    };
}

const parseRequest = async (c: Context) => {
    // check headers to be sure client can accept a response from us before following through the request
    // static assertion
    const accept = accepts(c.req).at(0);
    if (!accept) {
        throw new HTTPException(Status.BadRequest);
    }

    // parse the input and validate that it is ok
    const value = await new Promise<number>((res) =>
        res(Number(c.req.param("count") || "0"))
    );

    // static assertion on the `isHtmx` flag
    return { value, accept, isHtmx: c.req.headers.get("hx-request") !== null };
};

const doSomething = (n: number) => new Promise<number>((res) => res(n + 1));

class Hateoas<T extends Record<string, unknown>> {
    private map: Map<
        string,
        { method: "GET" | "POST" | "PUT" | "DELETE"; href: string }
    >;

    constructor(public readonly origin: string, public readonly data: T) {
        this.map = new Map();
    }

    set(name: string, method: "GET" | "POST" | "PUT" | "DELETE", path: string) {
        this.map.set(name, { method, href: new URL(path, this.origin).href });
    }

    get(name: string) {
        return this.map.get(name);
    }

    toJSON() {
        return { ...this.data, _links: Object.fromEntries(this.map.entries()) };
    }
}
