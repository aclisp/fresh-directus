import { Handlers, PageProps } from "$fresh/server.ts";
import { getCurrentUserInfo, UserInfo } from "@/utils/directus/users.ts";
import { State } from "@/utils/types.ts";
import Channel from "@/islands/Channel.tsx";
import { getLogger } from "$std/log/mod.ts";
import { Head } from "$fresh/runtime.ts";
import { redirectToLogin } from "@/utils/redirect-to-login.ts";

interface SubscribeData {
  channel: string | null;
  userInfo: UserInfo;
  accessToken: string;
}

function logger() {
  return getLogger("routes/sub");
}

export const handler: Handlers<SubscribeData, State> = {
  async GET(req, ctx) {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get("channel");
    const { accessToken } = ctx.state;
    if (!accessToken) {
      return redirectToLogin(req);
    }
    const userInfo = await getCurrentUserInfo(accessToken);
    const resp = await ctx.render({ channel, userInfo, accessToken });
    return resp;
  },
};

export default function Subscribe({ data }: PageProps<SubscribeData>) {
  return (
    <>
      <Head>
        <title>订阅频道</title>
      </Head>
      <div class="mt-2">
        <Channel
          accessToken={data.accessToken}
          channel={data.channel!}
          userInfo={data.userInfo}
        />
      </div>
    </>
  );
}
