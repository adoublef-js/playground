import { FormProps } from "$components/forms/types.ts";
import { Show } from "$components/control/show.tsx";

export const Form = ({
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
