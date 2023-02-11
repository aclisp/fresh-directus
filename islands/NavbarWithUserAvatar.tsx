import { DIRECTUS_HOST } from "../utils/directus/transport.ts";
import { useState } from "preact/hooks";
import { NavbarProps } from "./Navbar.tsx";

export default function NabarWithUserAvatar(props: NavbarProps) {
  const [menu1, setMenu1] = useState(false);
  const handleMenu1 = () => setMenu1((b) => !b);
  const closeMenu1 = () => setMenu1(false);

  return (
    <>
      {/* Icon */}
      <div class="dropdown relative">
        <a
          class="
        text-gray-500
        hover:text-gray-700
        focus:text-gray-700
        mr-4
        dropdown-toggle
        hidden-arrow
        flex items-center
      "
          href="#"
          id="dropdownMenuButton1"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="bell"
            class="w-4"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"
            >
            </path>
          </svg>
          <span class="text-white bg-red-700 absolute rounded-full text-xs -mt-2.5 ml-2 py-0 px-1.5">
            1
          </span>
        </a>
      </div>
      <div class="dropdown relative">
        <a
          class="dropdown-toggle flex items-center hidden-arrow"
          id="dropdownMenuButton2"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={handleMenu1}
        >
          <img
            src={getAvatar(props)}
            class="rounded-full"
            style="height: 25px; width: 25px"
            alt=""
            loading="lazy"
          />
        </a>
        <ul
          class={"dropdown-menu min-w-max absolute hidden bg-white text-base z-50 float-left" +
            " py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding" +
            " border-none left-auto right-0" + (menu1 ? " show" : "") +
            (props.menuShow ? " right-auto" : "")}
          aria-labelledby="dropdownMenuButton2"
        >
          <li>
            <a
              class="
      dropdown-item
      text-sm
      py-2
      px-4
      font-normal
      block
      w-full
      whitespace-nowrap
      bg-transparent
      text-gray-700
      hover:bg-gray-100
    "
              href="/profile"
              onClick={closeMenu1}
            >
              个人信息
            </a>
          </li>
          <li>
            <a
              class="
      dropdown-item
      text-sm
      py-2
      px-4
      font-normal
      block
      w-full
      whitespace-nowrap
      bg-transparent
      text-gray-700
      hover:bg-gray-100
    "
              href="#"
            >
              登出
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

function getAvatar(data: NavbarProps): string {
  return DIRECTUS_HOST + "/assets/" + data.avatar +
    "?access_token=" + data.token;
}
