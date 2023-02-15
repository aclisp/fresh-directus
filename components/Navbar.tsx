import { UserInfo } from "@/utils/directus/users.ts";
import { buttonLike } from "@/utils/styles.ts";
import { ComponentChildren } from "preact";
import { assets } from "@/utils/directus/assets.ts";

interface NavbarProps {
  userInfo?: UserInfo;
  accessToken?: string;
}

interface MenuItemProps {
  name: string;
  url: string;
}

export function Navbar(props: NavbarProps) {
  return (
    <nav class="
  relative
  w-full
  flex flex-wrap
  items-center
  justify-between
  py-4
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
          class="collapse navbar-collapse flex-grow items-center"
          id="navbarSupportedContent"
        >
          <Logo />
          {/* Left links */}
          <ul class="navbar-nav flex flex-col pl-0 list-none mr-auto">
            <NavItem name="Dashboard" url="#" />
            <NavItem name="Team" url="#" />
            <NavItem name="Projects" url="#" />
          </ul>
          {/* Left links */}
        </div>
        {/* Collapsible wrapper */}

        {/* Right elements */}
        <div class="flex items-center relative">
          {/* Icon */}
          {/* <IconBell /> */}
          {props.userInfo ? <MyAvatar {...props} /> : <ButtonLogin />}
        </div>
        {/* Right elements */}
      </div>
    </nav>
  );
}

function Logo() {
  return (
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
        style="height: 35px"
        alt=""
        loading="lazy"
      />
    </a>
  );
}

function NavItem(props: MenuItemProps) {
  return (
    <li class="nav-item p-2">
      <a
        class="nav-link text-gray-500 hover:text-gray-700 focus:text-gray-700 p-0"
        href={props.url}
      >
        {props.name}
      </a>
    </li>
  );
}

function ButtonLogin() {
  return (
    <a
      class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
      style={buttonLike}
      href="/login"
    >
      Login
    </a>
  );
}

function MyAvatar(props: NavbarProps) {
  return (
    <div class="dropdown relative">
      <a
        class="dropdown-toggle flex items-center hidden-arrow"
        href="#"
        id="dropdownMenuButton2"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src={assets(props.userInfo?.avatar, {
            accessToken: props.accessToken,
            altUrl: "/anonymous-avatar-icon-25.jpeg",
          })}
          class="rounded-full"
          style="height: 30px; width: 30px"
          alt=""
          loading="lazy"
        />
      </a>
      <DropdownMenu
        labelledBy="dropdownMenuButton2"
        menuItems={[
          { name: "Action", url: "#" },
          { name: "Another action", url: "#" },
          { name: "Something else here", url: "#" },
        ]}
      />
    </div>
  );
}

function IconBell() {
  return (
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
          class="w-5"
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
      <DropdownMenu
        labelledBy="dropdownMenuButton1"
        menuItems={[
          { name: "Action", url: "#" },
          { name: "Another action", url: "#" },
          { name: "Something else here", url: "#" },
        ]}
      />
    </div>
  );
}

function DropdownMenu(props: {
  labelledBy: string;
  menuItems: MenuItemProps[];
}) {
  return (
    <ul
      class="
      dropdown-menu
      min-w-max
      absolute
      hidden
      bg-white
      text-base
      z-50
      float-left
      py-2
      list-none
      text-left
      rounded-lg
      shadow-lg
      mt-1
      hidden
      m-0
      bg-clip-padding
      border-none
      left-auto
      right-0
    "
      aria-labelledby={props.labelledBy}
    >
      {props.menuItems.map((menuItem) => <DropdownMenuItem {...menuItem} />)}
    </ul>
  );
}

function DropdownMenuItem(props: MenuItemProps) {
  return (
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
        href={props.url}
      >
        {props.name}
      </a>
    </li>
  );
}
