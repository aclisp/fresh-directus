import { DIRECTUS_HOST } from "./constant.ts";

export interface LoginResult {
  ok: boolean;
  msg: string;
  access_token: string;
  expires: number;
  refresh_token: string;
}

function failure(res: Response): LoginResult {
  return {
    ok: false,
    msg: `${res.status} ${res.statusText}`,
    access_token: "",
    expires: 0,
    refresh_token: "",
  };
}

// Retrieve a temporary access token and refresh token.
export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  const res = await fetch(DIRECTUS_HOST + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  if (!res.ok) {
    return failure(res);
  }
  const json = await res.json();
  const loginResult: LoginResult = {
    ok: true,
    ...json.data,
  };
  return loginResult;
}

export function updateStorage(loginResult: LoginResult) {
  localStorage.setItem("access_token", loginResult.access_token);
  localStorage.setItem("access_token.expires_at", getExpiresAt(loginResult));
  localStorage.setItem("refresh_token", loginResult.refresh_token);
}

function getExpiresAt(loginResult: LoginResult): string {
  return (Date.now() + loginResult.expires).toString();
}

export class NeedLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NeedLoginError";
  }
}

export async function getAccessToken(): Promise<string> {
  const expiresAt = localStorage.getItem("access_token.expires_at");
  if (!expiresAt) {
    throw new NeedLoginError("never login");
  }
  if (+expiresAt < Date.now() + 30000) {
    const refreshToken = localStorage.getItem("refresh_token");
    const loginResult = await refresh(refreshToken!);
    if (loginResult.ok) {
      updateStorage(loginResult);
    } else {
      throw new NeedLoginError("refresh failure");
    }
  }
  return localStorage.getItem("access_token")!;
}

async function refresh(refreshToken: string): Promise<LoginResult> {
  const res = await fetch(DIRECTUS_HOST + "/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      mode: "json",
    }),
  });
  if (!res.ok) {
    return failure(res);
  }
  const json = await res.json();
  const loginResult: LoginResult = {
    ok: true,
    ...json.data,
  };
  return loginResult;
}
