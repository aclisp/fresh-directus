import { Handlers, PageProps } from "$fresh/server.ts";
import { getLogger } from "$std/log/mod.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  DIRECTUS_AUTH_COOKIE_NAME,
  login,
  LoginResult,
  updateStorage,
} from "$directus/auth.ts";
import { DIRECTUS_HOST } from "$directus/transport.ts";
import { getCurrentUserInfo, UserInfo } from "$directus/users.ts";
import { delStorageValue } from "$directus/storage.ts";
import { randomUUID } from "../utils/uuid.ts";

function logger() {
  return getLogger("routes/login");
}

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
  loginResult?: LoginResult;
  userInfo?: UserInfo;
}

const DEFAULT_LOGIN_DATA: LoginData = {
  email: "",
  password: "",
  rememberMe: true,
};

export const handler: Handlers<LoginData> = {
  GET(req, ctx) {
    return ctx.render(DEFAULT_LOGIN_DATA);
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe");
    logger().debug(
      `POST email=${email} password=${password} rememberMe=${rememberMe}`,
    );

    // 检查用户名和密码
    const loginResult = await login(email, password);
    logger().debug(`await login returns: ${JSON.stringify(loginResult)}`);
    if (!loginResult.ok) {
      const data: LoginData = {
        email,
        password,
        rememberMe: !!rememberMe,
        loginResult,
      };
      return ctx.render(data);
    }

    // 设置存储，获取到一个随机的 uid
    const lastUid = getCookies(req.headers)[DIRECTUS_AUTH_COOKIE_NAME];
    if (lastUid) {
      delStorageValue(lastUid);
      logger().debug(`deleted last uid: ${lastUid}`);
    }
    const newUid = randomUUID();
    const storageValue = updateStorage(newUid, loginResult);
    logger().debug(`update storage with new uid: ${newUid}`);

    // 获取当前用户的信息
    const userInfo = await getCurrentUserInfo(storageValue.access_token);
    logger().debug(
      `await get current user info returns: ${JSON.stringify(userInfo)}`,
    );

    const data: LoginData = {
      email,
      password,
      rememberMe: !!rememberMe,
      loginResult,
      userInfo,
    };
    const resp = await ctx.render(data);

    // 把随机的 uid 种到客户端 Cookie
    setCookie(resp.headers, {
      name: DIRECTUS_AUTH_COOKIE_NAME,
      value: newUid,
      expires: storageValue.refreshTokenExpiresAt,
      path: "/",
      sameSite: "Strict",
      httpOnly: true,
      //secure: true,
    });
    return resp;
  },
};

export default function Login({ data }: PageProps<LoginData>) {
  return (
    <section class="h-screen">
      <div class="px-6 h-full text-gray-800">
        <div class="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div class="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
            <img
              src="/draw2.webp"
              class="w-full"
              alt="Sample image"
            />
          </div>
          <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            {data.loginResult?.ok
              ? <LoginSuccess data={data} />
              : <LoginForm data={data} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function LoginForm(props: { data: LoginData }) {
  return (
    <>
      <LoginAlert data={props.data} />

      <form method="POST">
        <div class="flex flex-row items-center justify-center lg:justify-start">
          <p class="text-lg mb-6 mr-4">用户登录</p>
        </div>

        <div class="mb-6">
          <input
            type="text"
            class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="email"
            name="email"
            placeholder="账号"
            value={props.data.email}
          />
        </div>

        <div class="mb-6">
          <input
            type="password"
            class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="password"
            name="password"
            placeholder="密码"
            value={props.data.password}
          />
        </div>

        <div class="flex justify-between items-center mb-6">
          <a
            href="#!"
            class="text-sm text-gray-500"
          >
            忘记密码?
          </a>
        </div>

        <div class="text-center lg:text-left">
          <button
            type="submit"
            class="inline-block px-7 py-3 bg-blue-600 text-white font-medium leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            登 录
          </button>
          <p class="text-sm font-semibold mt-2 pt-1 mb-0">
            还没有账号?
            <a
              href="#!"
              class="ml-1 text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"
            >
              注册账号
            </a>
          </p>
        </div>
      </form>
    </>
  );
}

function LoginAlert(props: { data: LoginData }) {
  if (!props.data.loginResult || props.data.loginResult.ok) {
    return <></>;
  }

  return (
    <div
      class="bg-red-100 rounded-lg py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full"
      role="alert"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="exclamation-triangle"
        class="w-4 h-4 mr-2 fill-current"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
      >
        <path
          fill="currentColor"
          d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
        >
        </path>
      </svg>
      {props.data.loginResult.msg}
    </div>
  );
}

function LoginSuccess(props: { data: LoginData }) {
  return (
    <>
      <p class="text-xl italic mx-auto text-gray-700 max-w-4xl">
        Welcome back!
      </p>
      <div class="mt-12 mb-6 flex justify-center">
        <img
          src={getAvatar(props.data)}
          class="rounded-full w-24 h-24 shadow-lg"
          alt="smaple image"
        />
      </div>
      <p class="text-gray-500">
        {props.data.userInfo?.first_name}{" "}
        {props.data.userInfo?.last_name}, you will be redirected to home in 2
        seconds...
      </p>
    </>
  );
}

function getAvatar(data: LoginData): string {
  if (!data.userInfo?.avatar) {
    return "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp";
  } else {
    return DIRECTUS_HOST + "/assets/" + data.userInfo.avatar +
      "?access_token=" +
      data.loginResult?.access_token;
  }
}
