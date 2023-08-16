import { TextAreaProps } from "$components/forms/types.ts";
import { titleCase } from "$deps/case.ts";

export const TextArea = ({
    for: htmlFor,
    class: className,
    required,
    label,
    rows,
    cols,
    placeholder,
}: TextAreaProps) => {
    return (
        <div role="group">
            <label for={htmlFor}>{titleCase(htmlFor)}</label>
            <textarea
                name={htmlFor}
                id={htmlFor}
                required={required}
                placeholder={placeholder}
                rows={rows}
                cols={cols}
            ></textarea>
        </div>
    );
};
