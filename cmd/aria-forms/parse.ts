import {
    BaseSchema,
    Output,
    parse as _parse,
    ValiError,
} from "$deps/valibot.ts";

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
