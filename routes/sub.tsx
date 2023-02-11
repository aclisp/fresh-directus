import { Handlers, PageProps } from "$fresh/server.ts";
import { getCurrentUserInfo, UserInfo } from "$directus/users.ts";
import { State } from "../utils/types.ts";
import Channel from "../islands/Channel.tsx";
import { getLogger } from "$std/log/mod.ts";

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
      <p>CHANNEL {data.channel}</p>
      <Channel token={data.accessToken} channel={data.channel!} />
    </>
  );
}