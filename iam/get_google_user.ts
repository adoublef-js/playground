export async function getGoogleUser(accessToken: string) {
    // TODO error handling
    const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.json() as Promise<GoogleUser>;
}

export type GoogleUser = {
    sub: string;
    name: string;
    picture?: string;
    email: string;
    locale: string;
};
