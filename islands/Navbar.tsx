import { useState } from "preact/hooks";
import NabarWithUserAvatar from "@/islands/NavbarWithUserAvatar.tsx";

export interface NavbarProps {
  avatar?: string;
  token?: string;
  menuShow?: boolean; // 是否是小屏幕展示出主菜单的状态
}

export default function Navbar(props: NavbarProps) {
  const [menu, setMenu] = useState(false);
  const handleMenu = () => setMenu((b) => !b);

  return (
    <nav class="
  relative
  w-full
  flex flex-wrap
  items-center
  justify-between
  py-1
  bg-gray-100
  text-gray-500
  hover:text-gray-700
  focus:text-gray-700
  shadow-lg
  navbar navbar-expand-lg navbar-light
  ">
      <div class="w-full flex flex-wrap items-center justify-between px-6">
        <button
          class="
      navbar-toggler
      text-gray-500
      border-0
      hover:shadow-none hover:no-underline
      py-2
      px-2.5
      bg-transparent
      focus:outline-none focus:ring-0 focus:shadow-none focus:no-underline
    "
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={handleMenu}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="bars"
            class="w-6"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
            >
            </path>
          </svg>
        </button>
        <div
          class={"collapse navbar-collapse flex-grow items-center" +
            (menu ? " show" : "")}
          id="navbarSupportedContent"
        >
          <a
            class="
        flex
        items-center
        text-gray-900
        hover:text-gray-900
        focus:text-gray-900
        mt-2
        lg:mt-0
        mr-1
      "
            href="#"
          >
            <img
              src="/logo.svg"
              style="height: 25px"
              alt=""
              loading="lazy"
            />
          </a>
          {/* Left links */}
          <ul class="navbar-nav flex flex-col pl-0 list-none mr-auto">
            <li class="nav-item p-2">
              <a
                class="nav-link text-gray-500 hover:text-gray-700 focus:text-gray-700 p-0"
                href="/"
              >
                总览
              </a>
            </li>
            <li class="nav-item p-2">
              <a
                class="nav-link text-gray-500 hover:text-gray-700 focus:text-gray-700 p-0"
                href="#"
              >
                频道
              </a>
            </li>
            <li class="nav-item p-2">
              <a
                class="nav-link text-gray-500 hover:text-gray-700 focus:text-gray-700 p-0"
                href="#"
              >
                项目
              </a>
            </li>
          </ul>
          {/* Left links */}
        </div>
        {/* Collapsible wrapper */}

        {/* Right elements */}
        <div class="flex items-center relative p-2">
          {props.token
            ? (
              <NabarWithUserAvatar
                avatar={props.avatar}
                token={props.token}
                menuShow={menu}
              />
            )
            : <NavbarLogin />}
        </div>
        {/* Right elements */}
      </div>
    </nav>
  );
}

function NavbarLogin() {
  return (
    <a
      href="/login"
      class="text-blue-600 hover:text-blue-700 transition duration-300 ease-in-out"
    >
      登录
    </a>
  );
}
