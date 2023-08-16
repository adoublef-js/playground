import { Show } from "$components/control/show.tsx";
import { HtmlEscapedString } from "$deps/hono.ts";

type FormProps = {
    action: string;
    value?: string;
    disabled?: boolean;
    method?: "get" | "post";
    children?: HtmlEscapedString | HtmlEscapedString[];
    class?: string;
};

export function Form({
    children,
    action,
    method = "get",
    value = "Submit",
    class: className,
}: FormProps) {
    return (
        <form
            action={action}
            method={method}
            hx-target="this"
            hx-swap="outerHTML"
            class={className}
        >
            {children}
            <input type="submit" value={value} />
        </form>
    );
}

type TextFieldProps = {
    label?: string;
    placeholder?: string;
    htmlFor: string;
    value?: string;
    error?: string;
    reset?: unknown | boolean;
    class?: string;
};

export function TextField({
    htmlFor,
    placeholder,
    label,
    value,
    error,
    reset,
    class: className,
}: TextFieldProps) {
    return (
        <label htmlFor={htmlFor} class={className}>
            <Show when={label} fallback={<span>{htmlFor}</span>}>
                {(label) => <span>{label}</span>}
            </Show>
            <Show
                when={error}
                fallback={
                    <input
                        type="text"
                        name={htmlFor}
                        id={htmlFor}
                        placeholder={placeholder}
                        value={reset ? undefined : value}
                    />
                }
            >
                {(fooError) => (
                    <>
                        <input
                            type="text"
                            name={htmlFor}
                            id={htmlFor}
                            placeholder={placeholder}
                            value={value}
                        />
                        <span>{fooError}</span>
                    </>
                )}
            </Show>
        </label>
    );
}

type TextAreaProps = {
    label?: string;
    placeholder?: string;
    htmlFor: string;
    value?: string;
    error?: string;
    reset?: unknown | boolean;
    class?: string;
};

export function TextArea({
    htmlFor,
    placeholder,
    label,
    value,
    error,
    reset,
    class: className,
}: TextAreaProps) {
    return (
        <label htmlFor={htmlFor} class={className}>
            <Show when={label} fallback={<span>{htmlFor}</span>}>
                {(label) => <span>{label}</span>}
            </Show>
            <Show
                when={error}
                fallback={
                    <textarea
                        type="text"
                        name={htmlFor}
                        id={htmlFor}
                        placeholder={placeholder}
                        value={reset ? undefined : value}
                    />
                }
            >
                {(fooError) => (
                    <>
                        <textarea
                            type="text"
                            name={htmlFor}
                            id={htmlFor}
                            placeholder={placeholder}
                            value={value}
                        />
                        <span>{fooError}</span>
                    </>
                )}
            </Show>
        </label>
    );
}