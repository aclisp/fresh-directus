import { Handlers, PageProps } from "$fresh/server.ts";
import { getLogger } from "$std/log/mod.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  DIRECTUS_AUTH_COOKIE_NAME,
  login,
  LoginResult,
  updateStorage,
} from "@/utils/directus/auth.ts";
import { delStorageValue } from "@/utils/directus/storage.ts";
import { randomUUID } from "@/utils/uuid.ts";
import { AfxAppFrame } from "@/components/AfxAppFrame.tsx";
import { AfxFormInput } from "@/components/AfxFormInput.tsx";
import { AfxFormButton } from "@/components/AfxFormButton.tsx";
import InfoModal from "@/islands/InfoModal.tsx";
import AfxHeader from "@/islands/AfxHeader.tsx";

function logger() {
  return getLogger("routes/login");
}

interface LoginData {
  email: string;
  password: string;
  loginResult?: LoginResult;
}

export const handler: Handlers<LoginData> = {
  GET(req, ctx) {
    return ctx.render({
      email: "",
      password: "",
    });
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    logger().debug(
      `POST email=${email} password=${password}`,
    );

    // 检查用户名和密码
    const loginResult = await login(email, password);
    logger().debug(`await login returns: ${JSON.stringify(loginResult)}`);
    if (!loginResult.ok) {
      const data: LoginData = {
        email,
        password,
        loginResult,
      };
      return ctx.render(data);
    }

    // 设置存储，获取到一个随机的 sessionId
    const lastSid = getCookies(req.headers)[DIRECTUS_AUTH_COOKIE_NAME];
    if (lastSid) {
      delStorageValue(lastSid);
      logger().debug(`deleted last sessionId: ${lastSid}`);
    }
    const newSid = randomUUID();
    const storageValue = updateStorage(newSid, loginResult);
    logger().debug(`update storage with new sessionId: ${newSid}`);

    const resp = new Response(`Redirecting to ...`, {
      headers: { "Location": "/" },
      status: 303,
    });

    // 把随机的 sessionId 种到客户端 Cookie
    setCookie(resp.headers, {
      name: DIRECTUS_AUTH_COOKIE_NAME,
      value: newSid,
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
  let showLoginFailure = false;
  if (data.loginResult && !data.loginResult.ok) {
    showLoginFailure = true;
  }
  return (
    <>
      <AfxAppFrame>
        <AfxHeader name="登录" />
        <form method="POST">
          <div class="flex flex-col h-screen justify-center mx-12 gap-6">
            <AfxFormInput
              label="Your Email"
              type="email"
              id="email"
              name="email"
              value={data.email}
            />
            <AfxFormInput
              label="Your Password"
              type="password"
              id="password"
              name="password"
            />
            <div class="mt-6">
              <AfxFormButton label="Login" type="submit" />
            </div>
          </div>
        </form>
      </AfxAppFrame>
      <InfoModal
        show={showLoginFailure}
        type="error"
        title="Login failure"
        message={data.loginResult?.msg!}
        action="OK"
      />
    </>
  );
}
