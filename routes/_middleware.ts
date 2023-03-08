import * as log from "$std/log/mod.ts";
import { blue, cyan, green, red, yellow } from "$std/fmt/colors.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { State } from "@/utils/types.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  DIRECTUS_AUTH_COOKIE_NAME,
  getAccessToken,
  SessionIdentifier,
} from "@/utils/directus/auth.ts";

const pathnameWithSession = [
  "/",
  "/profile",
  "/sub",
  "/api/token",
];

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  // For Logging
  const start = Date.now();
  const { pathname } = new URL(req.url);
  const withSession = pathnameWithSession.includes(pathname);
  let sessionId: SessionIdentifier | undefined;
  let expires: number | undefined;

  if (withSession) {
    sessionId = getCookies(req.headers)[DIRECTUS_AUTH_COOKIE_NAME];
    try {
      const accessToken = await getAccessToken(sessionId, (storageValue) => {
        expires = storageValue.refreshTokenExpiresAt;
      });
      ctx.state = { sessionId, accessToken };
    } catch (error) {
      log.info(`${error.name}: ${error.message}`);
      ctx.state = { sessionId, accessToken: "" };
    }
  }

  const resp = await ctx.next();

  if (withSession && expires) {
    setCookie(resp.headers, {
      name: DIRECTUS_AUTH_COOKIE_NAME,
      value: sessionId!,
      expires,
      path: "/",
      sameSite: "Strict",
      httpOnly: true,
      //secure: true,
    });
  }
  const now = Date.now();
  const ms = now - start;
  const status = () => {
    const str = resp.status.toString();
    if (str[0] === "2") {
      return green(str);
    }
    if (str[0] === "3") {
      return yellow(str);
    } else {
      return red(str);
    }
  };
  resp.headers.set("X-Response-Time", `${ms}ms`);
  log.debug(
    `${blue(req.method)} ${cyan(pathname)} ${status()} ${String(ms) + "ms"}`,
  );
  return resp;
}
