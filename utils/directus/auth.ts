import { httpPost, Result } from "./transport.ts";

export interface LoginInfo {
  access_token: string;
  expires: number;
  refresh_token: string;
}

export type LoginResult = LoginInfo & Result;

export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  return await httpPost<LoginResult>("/auth/login", {
    email: email,
    password: password,
  }, {
    noAuthorizationHeader: true,
    accessToken: null,
  });
}

export function updateStorage(loginResult: LoginResult) {
  localStorage.setItem("access_token", loginResult.access_token);
  localStorage.setItem("access_token.expires_at", getExpiresAt(loginResult));
  localStorage.setItem("refresh_token", loginResult.refresh_token);
  setCookie("access_token", loginResult.access_token, loginResult.expires);
}

function setCookie(name: string, value: string, ms?: number) {
  let expires;
  if (ms) {
    const date = new Date();
    date.setTime(date.getTime() + ms);
    expires = "; expires=" + date.toUTCString();
  } else {
    expires = "";
  }
  document.cookie = name + "=" + value + expires +
    "; path=/; samesite=strict";
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
  return await httpPost<LoginResult>("/auth/refresh", {
    refresh_token: refreshToken,
    mode: "json",
  }, {
    noAuthorizationHeader: true,
    accessToken: null,
  });
}
