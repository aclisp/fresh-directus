import { getLogger } from "$std/log/mod.ts";
import { getAccessToken, SessionIdentifier } from "./auth.ts";

export const DIRECTUS_HOST = "http://127.0.0.1:8055";

export interface Result {
  ok: boolean;
  msg: string;
}

export interface TransportOptions {
  noAuthorizationHeader?: boolean;
  /** Skip refreshing the access token if it is null. */
  accessToken?: string | null;
  /** Global query parameters */
  params?: URLSearchParams;
  uid?: SessionIdentifier;
}

function logger() {
  return getLogger("directus/transport");
}

export async function httpPost<T>(
  path: string,
  data: Record<string, unknown>,
  options: TransportOptions = {},
): Promise<T & Result> {
  let {
    noAuthorizationHeader = false,
    accessToken,
    params,
    uid,
  } = options;
  logger().debug(`POST ${path}`);

  if (accessToken === undefined && uid) {
    accessToken = await getAccessToken(uid);
  }
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (!noAuthorizationHeader) {
    if (!accessToken) {
      throw new Error(`missing access token: ${accessToken}`);
    }
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  let url = DIRECTUS_HOST + path;
  if (params) {
    url += "?" + params;
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    return failure<T>(res);
  }
  return success<T>(res);
}

function failure<T>(res: Response): T & Result {
  return {
    ok: false,
    msg: `${res.status} ${res.statusText}`,
  } as T & Result;
}

async function success<T>(res: Response): Promise<T & Result> {
  const json = await res.json();
  return {
    ok: true,
    msg: `${res.status} ${res.statusText}`,
    ...json.data,
  };
}

export async function httpGet<T>(
  path: string,
  options: TransportOptions = {},
): Promise<T & Result> {
  let {
    noAuthorizationHeader = false,
    accessToken,
    params,
    uid,
  } = options;
  logger().debug(`GET ${path}`);

  if (accessToken === undefined && uid) {
    accessToken = await getAccessToken(uid);
  }
  const headers = new Headers();
  if (!noAuthorizationHeader) {
    if (!accessToken) {
      throw new Error(`missing access token: ${accessToken}`);
    }
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  let url = DIRECTUS_HOST + path;
  if (params) {
    url += "?" + params;
  }
  const res = await fetch(url, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    return failure<T>(res);
  }
  return success<T>(res);
}
