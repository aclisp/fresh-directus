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
