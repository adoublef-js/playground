/* [tagName cheatsheet](https://www.semrush.com/blog/html-tags-list/) */
import { Hono, logger, serveStatic } from "$deps/hono.ts";
import { oauth2Client } from "../iam/oauth_client.ts";
import { iam } from "../iam/mod.ts";
import { IamEnv, oauth } from "../iam/middleware.ts";
import { handleMain } from "../handle_main.tsx";
import { LibSqlEnv, libsql } from "$lib/libsql/middleware.ts";
import { createClient } from "$lib/libsql/create_client.ts";

const { exit } = Deno;

const libSqlClient = createClient({
    url: "file:playground.db",
});

try {
    if (!(await libSqlClient.execute("SELECT 1")).rows.at(0)) {
        throw new Error("could not ping database");
    }
} catch (error) {
    console.log("Error seeding db: ", error.message);

    exit(1);
}

if (import.meta.main) {
    const app = new Hono<IamEnv & LibSqlEnv>();

    app.use("*", logger(), oauth(oauth2Client), libsql(libSqlClient));
    app.get("/", handleMain());

    app.route("/", iam);

    app.use("*", serveStatic({ root: "./static/" }));

    Deno.serve(app.fetch);
}
