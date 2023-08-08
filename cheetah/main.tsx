import { cheetah } from "$deps/mod.ts";
import { handleHome } from "./handle_home.tsx";
import { iam } from "./iam/mod.ts";

const app = new cheetah();

app.get("/", handleHome());

app.use("/", iam);

app.serve();
