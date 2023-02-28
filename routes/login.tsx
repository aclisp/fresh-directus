import { Handlers, PageProps } from "$fresh/server.ts";
import { getLogger } from "$std/log/mod.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  DIRECTUS_AUTH_COOKIE_NAME,
  login,
  LoginResult,
  updateStorage,
} from "@/utils/directus/auth.ts";
import { getCurrentUserInfo, UserInfo } from "@/utils/directus/users.ts";
import { delStorageValue } from "@/utils/directus/storage.ts";
import { randomUUID } from "@/utils/uuid.ts";
import { assets } from "@/utils/directus/assets.ts";
import { AfxAppFrame } from "@/components/AfxAppFrame.tsx";
import { AfxFormInput } from "@/components/AfxFormInput.tsx";
import { AfxFormButton } from "../components/AfxFormButton.tsx";

function logger() {
  return getLogger("routes/login");
}

interface LoginData {
  email: string;
  password: string;
  loginResult?: LoginResult;
  userInfo?: UserInfo;
}

export const handler: Handlers<LoginData> = {
  GET(req, ctx) {
    return ctx.render({
      email: "",
      password: "",
    });
  },
};

export default function Login({ data }: PageProps<LoginData>) {
  return (
    <AfxAppFrame>
      <form>
        <div class="flex flex-col h-screen justify-center mx-12 gap-6">
          <AfxFormInput label="Your Email" type="email" id="email" />
          <AfxFormInput label="Your Password" type="password" id="password" />
          <div class="mt-6">
            <AfxFormButton label="Login" type="submit" />
          </div>
        </div>
      </form>
    </AfxAppFrame>
  );
}
