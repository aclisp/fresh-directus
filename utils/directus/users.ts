import { httpGet } from "./transport.ts";

export interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

type KeysEnum<T> = { [P in keyof Required<T>]: true };

export async function getCurrentUserInfo(
  token: string,
): Promise<UserInfo> {
  const keys: KeysEnum<UserInfo> = {
    id: true,
    first_name: true,
    last_name: true,
    avatar: true,
  };
  const fields = Object.keys(keys).join(",");
  const params = new URLSearchParams();
  params.append("fields", fields);
  return await httpGet<UserInfo>("/users/me", { params, accessToken: token });
}
