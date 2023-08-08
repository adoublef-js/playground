import { createAuth0OAuth2Client } from "$deps/deno_kv_oauth.ts";

export const oauthClient = createAuth0OAuth2Client({
    redirectUri: "http://localhost:8000/callback",
    defaults: {
        scope: "openid profile",
    },
});

const params = new URLSearchParams();
params.append("returnTo", new URL(oauthClient.config.redirectUri!).origin);
params.append("client_id", oauthClient.config.clientId);

export const logoutUrl = new URL(
    `v2/logout?${params}`,
    new URL(oauthClient.config.authorizationEndpointUri).origin
);
