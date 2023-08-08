import { Collection } from "$deps/mod.ts";
import { handleCallback } from "./handle_callback.ts";
import { handleSignin } from "./handle_signin.ts";
import { handleSignout } from "./handle_signout.ts";

export const iam = new Collection();

iam.get("/signin", handleSignin());
iam.get("/callback", handleCallback());
iam.get("/signout", handleSignout());
