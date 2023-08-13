// https://github.com/dyedgreen/deno-sqlite
// import { DB } from "https://deno.land/x/sqlite@v3.7.2/mod.ts";
import { assertEquals } from "https://deno.land/std@0.193.0/testing/asserts.ts";
import { DB } from "../../vendor/deno.land/x/sqlite/mod.ts";

// requires --allow-read --allow-write
// dyedgreen/deno-sqlite
Deno.test("Dao()", async (test) => {
    await test.step("return version of database", (_) => {
        const dao = new DB();
        const [[version]] = dao.query<[string]>("select sqlite_version()");

        assertEquals(version, "3.42.0");

        dao.close();
    });
});
