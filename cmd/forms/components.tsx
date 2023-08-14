import { Show } from "$components/control/show.tsx";
import { HtmlEscapedString } from "$deps/hono.ts";

type FormProps = {
    action: string;
    value?: string;
    disabled?: boolean;
    method?: "get" | "post";
    children?: HtmlEscapedString | HtmlEscapedString[];
};

export function Form({
    children,
    action,
    method = "get",
    value = "Submit",
}: FormProps) {
    return (
        <form
            action={action}
            method={method}
            hx-target="this"
            hx-swap="outerHTML"
        >
            {children}
            <input type="submit" value={value} />
        </form>
    );
}

type InputProps = {
    label?: string;
    placeholder?: string;
    htmlFor: string;
    value?: string;
    error?: string;
    reset?: boolean;
};

export function Input({
    htmlFor,
    placeholder,
    label,
    value,
    error,
    reset,
}: InputProps) {
    return (
        <label htmlFor={htmlFor}>
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
