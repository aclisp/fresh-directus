import Counter from "@/islands/Counter.tsx";
import { getCurrentUserInfo, UserInfo } from "@/utils/directus/users.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "@/utils/types.ts";
import IconLogin from "tabler-icons/login.tsx";
import { AfxAppFrame } from "@/components/AfxAppFrame.tsx";
import { assets } from "@/utils/directus/assets.ts";

interface HomeData {
  userInfo: UserInfo;
  accessToken: string;
}

export const handler: Handlers<HomeData, State> = {
  async GET(req, ctx) {
    const { accessToken } = ctx.state;
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
    <AfxAppFrame>
      <Header
        name="主页"
        userInfo={data?.userInfo}
        accessToken={data?.accessToken}
      />
    </AfxAppFrame>
  );
}

function WelcomeToFresh() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <img
        src="/logo.svg"
        class="w-32 h-32"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />
      <p class="my-6">
        Welcome to `fresh`. Try updating this message in the ./routes/index.tsx
        file, and refresh.
      </p>
      <Counter start={3} />
    </div>
  );
}

function Header(props: {
  name: string;
  userInfo: UserInfo;
  accessToken: string;
}) {
  return (
    <>
      {/* Header */}
      <div
        class="fixed top-0 bg-gray-100 h-11 flex items-center"
        style="width: inherit; max-width: inherit"
      >
        <div class="relative grow">
          {/* Left part */}

          {/* Title */}
          <div class="flex justify-center py-2">
            <div class="font-medium">{props.name}</div>
          </div>
          {/* Right part */}
          <HeaderRightItem
            userInfo={props.userInfo}
            accessToken={props.accessToken}
          />
        </div>
      </div>
      {/* Header Placeholder */}
      <div class="w-full h-11"></div>
    </>
  );
}

function HeaderRightItem(props: HomeData) {
  return (
    <div class="absolute inset-y-0 right-0">
      {props.userInfo
        ? <HeaderAvatarButton {...props} />
        : <HeaderLoginButton />}
    </div>
  );
}

function HeaderLoginButton() {
  return (
    <a class="block px-4 py-2" href="/login">
      <IconLogin class="w-6 h-6 stroke-[1.5]" />
    </a>
  );
}

function HeaderAvatarButton(props: HomeData) {
  return (
    <a class="block px-4 py-2" href="/profile">
      <img
        src={assets(props.userInfo?.avatar, {
          accessToken: props.accessToken,
          altUrl: "/anonymous-avatar-icon-25.jpeg",
        })}
        class="rounded-full w-6 h-6"
        alt=""
        loading="lazy"
      />
    </a>
  );
}
