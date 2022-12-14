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
  email: "admin",
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
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
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
          <p class="text-lg mb-0 mr-4">Sign in with</p>
          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            class="inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              class="w-4 h-4"
            >
              <path
                fill="currentColor"
                d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
              />
            </svg>
          </button>

          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            class="inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="w-4 h-4"
            >
              <path
                fill="currentColor"
                d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
              />
            </svg>
          </button>

          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            class="inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="w-4 h-4"
            >
              <path
                fill="currentColor"
                d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
              />
            </svg>
          </button>
        </div>

        <div class="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p class="text-center font-semibold mx-4 mb-0">Or</p>
        </div>

        <div class="mb-6">
          <input
            type="text"
            class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="email"
            name="email"
            placeholder="Email address"
            value={props.data.email}
          />
        </div>

        <div class="mb-6">
          <input
            type="password"
            class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="password"
            name="password"
            placeholder="Password"
            value={props.data.password}
          />
        </div>

        <div class="flex justify-between items-center mb-6">
          <div class="form-group form-check">
            <input
              type="checkbox"
              class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              id="rememberMe"
              name="rememberMe"
              checked={props.data.rememberMe}
            />
            <label
              class="form-check-label inline-block text-gray-800"
              for="rememberMe"
            >
              Remember me
            </label>
          </div>
          <a href="#!" class="text-gray-800">Forgot password?</a>
        </div>

        <div class="text-center lg:text-left">
          <button
            type="submit"
            class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Login
          </button>
          <p class="text-sm font-semibold mt-2 pt-1 mb-0">
            Don't have an account?
            <a
              href="#!"
              class="ml-1 text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out"
            >
              Register
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
