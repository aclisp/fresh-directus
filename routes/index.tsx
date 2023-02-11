import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import Navbar from "../islands/Navbar.tsx";
import { getCurrentUserInfo, UserInfo } from "../utils/directus/users.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../utils/types.ts";

interface HomeData {
  userInfo: UserInfo;
  accessToken: string;
}

export const handler: Handlers<HomeData, State> = {
  async GET(req, ctx) {
    const { uid, accessToken } = ctx.state;
    try {
      const userInfo = await getCurrentUserInfo(accessToken);
      const resp = await ctx.render({ userInfo, accessToken });
      return resp;
    } catch (error) {
      return await ctx.render();
    }
  },
};

export default function Home({ data }: PageProps<HomeData>) {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <Navbar avatar={data?.userInfo?.avatar} token={data?.accessToken} />
      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class="my-6">
          Welcome to `fresh`. Try updating this message in the
          ./routes/index.tsx file, and refresh.
        </p>
        <Counter start={3} />
      </div>
    </>
  );
}
