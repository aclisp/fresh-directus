import { Handlers, PageProps } from "$fresh/server.ts";
import { getCurrentUserInfo, UserInfo } from "@/utils/directus/users.ts";
import { State } from "@/utils/types.ts";
import { assets } from "@/utils/directus/assets.ts";
import { AfxAppFrame } from "@/components/AfxAppFrame.tsx";
import AfxHeader from "@/islands/AfxHeader.tsx";

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
    <AfxAppFrame>
      <AfxHeader name="用户信息" placeholder icon="logout" url="/logout" />
      <div class="mt-10 text-center">
        <img
          src={assets(data.userInfo.avatar, { accessToken: data.accessToken })}
          class="rounded-full w-32 mb-4 mx-auto"
          alt="Avatar"
        />
        <h5 class="text-xl font-medium leading-tight mb-2">
          {data.userInfo.first_name} {data.userInfo.last_name}
        </h5>
        <p class="text-gray-500">Web designer</p>
      </div>
    </AfxAppFrame>
  );
}
