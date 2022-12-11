import { DIRECTUS_HOST } from "./constant.ts";
import { Context } from "./context.ts";

export interface UserInfo {
  first_name: string;
  last_name: string;
  avatar: string;
}

export async function getUserInfo(ctx: Context): Promise<UserInfo> {
  const params = new URLSearchParams();
  params.append("fields[]", "first_name");
  params.append("fields[]", "last_name");
  params.append("fields[]", "avatar");
  const res = await fetch(DIRECTUS_HOST + "/users/me?" + params, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${ctx.access_token}`,
    },
  });
  const json = await res.json();
  return json.data;
}
