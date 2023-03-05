import { Handlers } from "$fresh/server.ts";
import { deleteCookie, getCookies } from "$std/http/cookie.ts";
import { DIRECTUS_AUTH_COOKIE_NAME } from "@/utils/directus/auth.ts";
import { delStorageValue } from "@/utils/directus/storage.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const uid = getCookies(req.headers)[DIRECTUS_AUTH_COOKIE_NAME];
    if (uid) {
      delStorageValue(uid);
    }

    const resp = new Response(`Redirecting to ...`, {
      headers: { "Location": "/" },
      status: 303,
    });
    deleteCookie(resp.headers, DIRECTUS_AUTH_COOKIE_NAME);
    return resp;
  },
};
