import { getStorageValue, setStorageValue, StorageValue } from "./storage.ts";
import { httpPost, Result } from "./transport.ts";

export const DIRECTUS_AUTH_COOKIE_NAME = "_uid";
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
  uid: SessionIdentifier,
  loginResult: LoginResult,
): StorageValue {
  const now = Date.now();
  const expiresAt = now + DIRECTUS_AUTH_COOKIE_MAX_AGE_SECONDS * 1000;
  const value = {
    ...loginResult,
    accessTokenExpiresAt: now + loginResult.expires,
    //accessTokenExpiresAt: now + 60000,
    refreshTokenExpiresAt: expiresAt,
  };
  setStorageValue(uid, value);
  return value;
}

export class NeedLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NeedLoginError";
  }
}

export async function getAccessToken(
  uid: SessionIdentifier,
  onRefresh?: (storageValue: StorageValue) => void,
): Promise<string> {
  let storageValue = getStorageValue(uid);
  if (!storageValue) {
    throw new NeedLoginError("never login");
  }
  const expiresAt = storageValue.accessTokenExpiresAt;
  if (+expiresAt < Date.now() + 30000) {
    const refreshToken = storageValue.refresh_token;
    const loginResult = await refresh(refreshToken!);
    if (loginResult.ok) {
      storageValue = updateStorage(uid, loginResult);
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
