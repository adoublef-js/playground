// https://github.com/ulid/spec
// https://github.com/kt3k/ulid/blob/main/mod.ts
import { decodeTime, ulid } from "$deps/ulid.ts";
import { assert } from "$deps/std/assert.ts";

/** TODO */
export class Ulid {
    #value: string;

    constructor(id?: string) {
        try {
            if (id) {
                assert(decodeTime(id));
                this.#value = id;
            } else {
                this.#value = ulid();
            }
        } catch (error) {
            if (!(error instanceof Error)) {
                throw Error("unrecognized error", { cause: error });
            }

            throw new TypeError(`${error.message}`);
        }
    }
    /** String representation of an Id */
    toString(): string {
        return this.#value;
    }
    /** Length returns the size of the Id */
    get length() {
        return this.#value.length;
    }
    // https://github.com/oklog/ulid/blob/main/ulid.go#L480C1-L484C2
    localeCompare(other: Ulid): number {
        return this.#value.localeCompare(other.#value);
    }

    static localeCompare(a: Ulid, b: Ulid): number {
        return a.localeCompare(b);
    }

    /** Creates a string representation of an Id */
    static toString(): string {
        return new Ulid().toString();
    }
}
