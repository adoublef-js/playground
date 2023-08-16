import { titleCase } from "$deps/case.ts";
import { TextFieldProps } from "$components/forms/types.ts";

/* 
autocomplete
*/

export const TextField = ({
    type = "text",
    for: htmlFor,
    class: className,
    required,
    form,
    label,
    pattern,
    title,
    placeholder,
}: TextFieldProps) => {
    // minlength, maxlength, pattern, size
    // autocorrect,inputmode
    return (
        <div role="group">
            <label for={htmlFor}>{titleCase(htmlFor)}</label>
            <input
                type={type}
                name={htmlFor}
                id={htmlFor}
                required={required}
                placeholder={placeholder}
                pattern={pattern}
                title={title}
            />
        </div>
    );
};

// URLField

// EmailField

// SearchField

// TelField
