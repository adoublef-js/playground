/* https://github.com/denoland/saaskit/blob/main/utils/redirect.ts */
import { deleteCookie, getCookies } from "$deps/std/http.ts";

export const REDIRECT_URL_COOKIE_NAME = "redirect-url";

export function deleteRedirectUrlCookie(headers: Headers) {
    deleteCookie(headers, REDIRECT_URL_COOKIE_NAME);
}

export function getRedirectUrlCookie(headers: Headers) {
    return getCookies(headers)[REDIRECT_URL_COOKIE_NAME];
}
