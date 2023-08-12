import { Ulid } from "$lib/id/ulid.ts";
import { assertEquals } from "$deps/std/assert.ts";

Deno.test("Ulid()", async (test) => {
    await test.step("generate random id", () => {
        const a = new Ulid();
        assertEquals(a.length, 26);
    });

    await test.step("generate Id object from raw string", () => {
        const raw = "01ARYZ6S41YYYYYYY0YYYYYYZ1";
        const a = new Ulid(raw);
        assertEquals(a.length, 26);
    });

    await test.step("localCompare()", async (test) => {
        await test.step("a comes before b", () => {
            const a = new Ulid("01H7M81TB45591CN57TW99TQ8Y");
            const b = new Ulid("01H7M81TB6246K2BRTWWXS5B74");

            assertEquals(a.localeCompare(b), -1);
        });
    });
});
