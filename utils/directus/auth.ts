import { jwtDecode } from "../jwt.ts";
import { getStorageValue, setStorageValue, StorageValue } from "./storage.ts";
import { httpPost, Result } from "./transport.ts";

export const DIRECTUS_AUTH_COOKIE_NAME = "_sid";
export const DIRECTUS_AUTH_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export type SessionIdentifier = string;

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

export function updateStorage(
  sessionId: SessionIdentifier,
  loginResult: LoginResult,
): StorageValue {
  const value: StorageValue = {
    access_token: loginResult.access_token,
    refresh_token: loginResult.refresh_token,
    expires_at: Math.trunc(Date.now() / 1000) +
      DIRECTUS_AUTH_COOKIE_MAX_AGE_SECONDS,
  };
  setStorageValue(sessionId, value);
  return value;
}

export class NeedLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NeedLoginError";
  }
}

export async function getAccessToken(
  sessionId: SessionIdentifier,
  onRefresh?: (storageValue: StorageValue) => void,
): Promise<string> {
  let storageValue = getStorageValue(sessionId);
  if (!storageValue) {
    throw new NeedLoginError("never login");
  }
  const expiresAt = 1000 * jwtDecode(storageValue.access_token).exp!;
  if (expiresAt < Date.now() + 30000) {
    const refreshToken = storageValue.refresh_token;
    const loginResult = await refresh(refreshToken);
    if (loginResult.ok) {
      storageValue = updateStorage(sessionId, loginResult);
      if (onRefresh) {
        onRefresh(storageValue);
      }
    } else {
      throw new NeedLoginError("refresh failure");
    }
  }
  return storageValue.access_token;
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
