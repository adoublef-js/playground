import { HtmlEscapedString } from "$deps/hono.ts";

export type FormProps = {
    children?: HtmlEscapedString | HtmlEscapedString[];
    action: string;
    method?: "get" | "post";
    value?: string;
    disabled?: boolean;
    class?: string;
    required?: HtmlEscapedString;
};

type FieldProps = {
    accept?: string;
};

export type TextFieldProps = {
    for: string;
    required?: boolean;
    type?: Types;
    form?: string;
    class?: string;
    label?: boolean;
    placeholder?: string;
    pattern?: string;
    title?: string;
    inputmode?: InputMode;
};

export type TextAreaProps = {
    autocomplete?: "off" | "on";
    autocorrect?: "off" | "on";
    autofocus?: boolean;
    cols?: number;
    dirname?: string;
    disabled?: boolean;
    form?: string;
    maxlength?: number;
    minlength?: number;
    name?: string;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    rows?: number;
    spellcheck?: "default" | boolean;
    wrap?: "hard" | "soft" | "off";
    class?: string;
};

type InputMode = (typeof inputmodes)[number];

const inputmodes = [
    "none",
    "text",
    "decimal",
    "numeric",
    "tel",
    "search",
    "email",
    "url",
] as const;

type Types = (typeof types)[number];

const types = [
    "button",
    "checkbox",
    "color",
    "date",
    "datetime-local",
    "email",
    "file",
    "hidden",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "search",
    "submit",
    "tel",
    "text",
    "time",
    "url",
    "week",
] as const;
