import { Hono } from "$deps/hono.ts";
import { handleSignOut } from "./handle_signout.ts";
import { handleCallback } from "./handle_callback.ts";
import { handleSignIn } from "./handle_signin.ts";
import { IamEnv } from "./middleware.ts";

const app = new Hono<IamEnv>();

app.get("/signin", handleSignIn());
app.get("/callback", handleCallback());
app.get("/signout", handleSignOut());

export { app as iam };
