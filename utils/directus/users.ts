import { getAccessToken } from "./auth.ts";
import { DIRECTUS_HOST } from "./constant.ts";

export interface UserInfo {
  first_name: string;
  last_name: string;
  avatar: string;
}

export async function getCurrentUserInfo(): Promise<UserInfo> {
  const params = new URLSearchParams();
  params.append("fields[]", "first_name");
  params.append("fields[]", "last_name");
  params.append("fields[]", "avatar");
  const accessToken = await getAccessToken();
  const res = await fetch(DIRECTUS_HOST + "/users/me?" + params, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  const json = await res.json();
  return json.data;
}
