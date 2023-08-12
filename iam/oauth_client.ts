import { createGoogleOAuth2Client } from "$deps/deno_kv_oauth.ts";

const { env } = Deno;

export const oauth2Client = createGoogleOAuth2Client({
    redirectUri: `${env.get("HOSTNAME")}/callback`,
    defaults: {
        scope: env.get("GOOGLE_SCOPE")?.split(",") || "openid",
    },
});
