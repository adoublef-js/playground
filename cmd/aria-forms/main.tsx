import {
    Handler,
    Hono,
    HtmlEscapedString,
    logger,
    memo,
    serveStatic,
} from "$deps/hono.ts";
import {
    BaseSchema,
    Output,
    parse as _parse,
    ValiError,
    minLength,
    maxLength,
    object,
    string,
    optional,
} from "$deps/valibot.ts";
import { titleCase } from "$deps/case.ts";
import { Html } from "$components/dom/html.tsx";
import { Show } from "$components/control/show.tsx";
import { email } from "https://deno.land/x/valibot@v0.12.0/mod.ts";

const { serve } = Deno;

/* 
1, https://lsnrae.medium.com/accessible-form-validation-9fa637ddb0fc
2, https://blog.pope.tech/2022/10/03/a-beginners-complete-guide-to-form-accessibility-the-5-things-accessible-forms-needs-and-how-to-fix-common-errors/
3, https://kittygiraudel.com/2022/08/05/the-required-fault-in-our-stars/
4, https://www.smashingmagazine.com/2023/02/guide-accessible-form-validation/#:~:text=Accessibility%20In%20Forms,-Before%20we%20get&text=This%20is%20mostly%20about%20setting,indicator%20for%20each%20form%20control.&text=Each%20form%20field%20must%20have,field%20name%20to%20its%20user.
*/

if (import.meta.main) {
    const app = new Hono();

    app.use("*", logger());

    app.get("/", handleMainPage());

    app.post("/", handleFormSubmit());

    app.use("*", serveStatic({ root: "/static/" }));

    serve(app.fetch);
}

function handleMainPage(): Handler {
    return ({ html }) => {
        return html(
            <Html stylesheets={["/css/aria-forms.css"]}>
                <main>
                    <Form action="/" method="get" /* required={<Warning />} */>
                        <TextField
                            placeholder="e.g. johnbrown@mail.com"
                            label
                            type="email"
                            for="email"
                            required
                        />
                        <TextField
                            placeholder="e.g. John"
                            label
                            for="firstName"
                            required
                        />
                        <TextField
                            placeholder="e.g. Brown"
                            label
                            for="lastName"
                        />
                        <TextField
                            placeholder=""
                            label
                            type="password"
                            for="password"
                            required
                        />
                        <TextArea label for="bio" rows={4} />
                    </Form>
                </main>
            </Html>
        );
    };
}

function handleFormSubmit(): Handler {
    const user = object({
        email: string([email(), maxLength(100)]),
        firstName: string([minLength(3), maxLength(30)]),
        lastName: optional(string()),
        // transform to a password class
        password: string([]),
        bio: optional(string([maxLength(255)])),
    });

    return async ({ req, html }) => {
        const [data, error] = parse(user, await req.parseBody());

        console.log({ data, error });

        return html(
            <Html stylesheets={["/css/aria-forms.css"]}>
                <main>
                    <Form action="/" method="get" /* required={<Warning />} */>
                        <TextField label type="email" for="email" required />
                        <TextField label for="firstName" required />
                        <TextField label for="lastName" />
                        <TextField
                            label
                            type="password"
                            for="password"
                            required
                        />
                        <TextArea label for="bio" rows={4} />
                    </Form>
                </main>
            </Html>
        );
    };
}

type FormProps = {
    children?: HtmlEscapedString | HtmlEscapedString[];
    action: string;
    method?: "get" | "post";
    value?: string;
    disabled?: boolean;
    class?: string;
    required?: HtmlEscapedString;
};

const Form = ({
    children,
    action,
    method = "get",
    value = "Submit",
    disabled,
    class: className,
    required,
}: FormProps) => {
    return (
        <form action={action} method={method} class={className}>
            <Show when={required}>{(required) => required}</Show>
            {children}
            <input type="submit" value={value} disabled={disabled} />
        </form>
    );
};

type TextFieldProps = {
    for: string;
    required?: boolean;
    type?: "text" | "email" | "password";
    form?: string;
    class?: string;
    label?: boolean;
    placeholder?: string;
};

const TextField = ({
    type = "text",
    for: htmlFor,
    class: className,
    required,
    form,
    label,
    placeholder,
}: TextFieldProps) => {
    return (
        <label for={htmlFor} class={className}>
            <Show when={label}>
                <Label value={titleCase(htmlFor)} required={required} />
            </Show>
            <input
                type={type}
                name={htmlFor}
                id={htmlFor}
                required={required}
                placeholder={placeholder}
            />
            {/* <small role="tooltip">Hint: Type anything here.</small> */}
        </label>
    );
};

type TextAreaProps = Omit<TextFieldProps, "type"> & {
    rows?: number;
    cols?: number;
};

const TextArea = ({
    for: htmlFor,
    class: className,
    required,
    label,
    rows,
    cols,
    placeholder,
}: TextAreaProps) => {
    return (
        <label for={htmlFor} class={className}>
            <Show when={label}>
                <Label value={titleCase(htmlFor)} required={required} />
            </Show>
            <textarea
                name={htmlFor}
                id={htmlFor}
                required={required}
                rows={rows}
                cols={cols}
                placeholder={placeholder}
            ></textarea>
            {/* <small role="tooltip">Hint: Type anything here.</small> */}
        </label>
    );
};

type LabelProps = {
    value: string;
    required?: boolean;
};

const Label = ({ value, required }: LabelProps) => {
    return (
        <small>
            {value}
            <Show when={required}>
                <Asterisk />
            </Show>
        </small>
    );
};

const Asterisk = memo(() => (
    <span title="required" aria-hidden>
        *
    </span>
));

/** [docs](https://valibot.dev/guides/errors/) */
export function parse<TSchema extends BaseSchema>(
    schema: TSchema,
    input: unknown
): [
    Output<TSchema>,
    Partial<Record<keyof Output<TSchema>, string>> | undefined
] {
    try {
        return [_parse(schema, input), undefined];
    } catch (error) {
        // deno-lint-ignore prefer-const
        let _error: Partial<Record<keyof Output<TSchema>, string>> = {};
        for (const issue of (error as ValiError).issues) {
            const { message, path, reason, input } = issue;
            const { key, value } = path?.at(0)!;
            _error[key as keyof Output<TSchema>] = message;
        }
        return [input as Output<TSchema>, _error];
    }
}
