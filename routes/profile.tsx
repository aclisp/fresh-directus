import { Handlers, PageProps } from "$fresh/server.ts";
import { getCurrentUserInfo, UserInfo } from "$directus/users.ts";
import { DIRECTUS_HOST } from "$directus/transport.ts";
import { State } from "../utils/types.ts";
import Navbar from "../islands/Navbar.tsx";
import { Head } from "$fresh/runtime.ts";

interface ProfileData {
  userInfo: UserInfo;
  accessToken: string;
}

export const handler: Handlers<ProfileData, State> = {
  async GET(req, ctx) {
    const { uid, accessToken } = ctx.state;
    const userInfo = await getCurrentUserInfo(accessToken);
    const resp = await ctx.render({ userInfo, accessToken });
    return resp;
  },
};

export default function Profile({ data }: PageProps<ProfileData>) {
  return (
    <>
      <Head>
        <title>个人信息</title>
      </Head>
      <Navbar avatar={data.userInfo.avatar} token={data.accessToken} />
      <div class="mt-10 text-center">
        <img
          src={getAvatar(data)}
          class="rounded-full w-32 mb-4 mx-auto"
          alt="Avatar"
        />
        <h5 class="text-xl font-medium leading-tight mb-2">
          {data.userInfo.first_name} {data.userInfo.last_name}
        </h5>
        <p class="text-gray-500">Web designer</p>
      </div>
    </>
  );
}

function getAvatar(data: ProfileData): string {
  return DIRECTUS_HOST + "/assets/" + data.userInfo.avatar +
    "?access_token=" + data.accessToken;
}
