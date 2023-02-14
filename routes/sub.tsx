import { Handlers, PageProps } from "$fresh/server.ts";
import { getCurrentUserInfo, UserInfo } from "@/utils/directus/users.ts";
import { State } from "@/utils/types.ts";
import Channel from "@/islands/Channel.tsx";
import { getLogger } from "$std/log/mod.ts";
import Navbar from "@/islands/Navbar.tsx";
import { Head } from "$fresh/runtime.ts";

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
    const userInfo = await getCurrentUserInfo(accessToken);
    logger().debug(`accessToken: ${accessToken}`);
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
      <Navbar avatar={data.userInfo.avatar} token={data.accessToken} />
      <div class="mt-2">
        <Channel token={data.accessToken} channel={data.channel!} />
      </div>
    </>
  );
}
