import { createAuth0OAuth2Client } from "$deps/deno_kv_oauth.ts";

const redirectUri =
    Deno.env.get("OAUTH2_REDIRECT_URL") ?? "http://localhost:8000/callback";

const scope = Deno.env.get("AUTH0_SCOPE") ?? "openid";

export const oauthClient = createAuth0OAuth2Client({
    redirectUri,
    defaults: {
        scope,
    },
});

const params = new URLSearchParams();
params.append("returnTo", new URL(oauthClient.config.redirectUri!).origin);
params.append("client_id", oauthClient.config.clientId);

export const logoutUrl = new URL(
    `v2/logout?${params}`,
    new URL(oauthClient.config.authorizationEndpointUri).origin
);
