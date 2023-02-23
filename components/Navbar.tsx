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
    <nav
      class="flex-no-wrap relative flex w-full items-center justify-between bg-neutral-100 py-1.5 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap lg:justify-start"
      data-te-navbar-ref
    >
      <div class="flex w-full flex-wrap items-center justify-between px-6">
        <button
          class="block border-0 bg-transparent py-2 px-2.5 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
          type="button"
          data-te-collapse-init
          data-te-target="#navbarSupportedContent1"
          aria-controls="navbarSupportedContent1"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="[&>svg]:w-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-7 w-7"
            >
              <path
                fill-rule="evenodd"
                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>
        <div
          class="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
          id="navbarSupportedContent1"
          data-te-collapse-item
        >
          <Logo />
          {/* Left links */}
          <ul
            class="list-none mr-auto flex flex-col pl-0 lg:flex-row"
            data-te-navbar-nav-ref
          >
            <NavItem name="Explore" url="/debug/explore" />
            <NavItem name="Play" url="/debug/play" />
            <NavItem name="Profile" url="/profile" />
          </ul>
          {/* Left links */}
        </div>
        {/* Collapsible wrapper */}

        {/* Right elements */}
        <div class="relative flex items-center">
          {/* Icon */}
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
      class="mt-2 mr-2 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mt-0"
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
    <li class="lg:pr-2" data-te-nav-item-ref>
      <a
        class="text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-zinc-400"
        href={props.url}
        data-te-nav-link-ref
      >
        {props.name}
      </a>
    </li>
  );
}

function ButtonLogin() {
  return (
    <a
      class="px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      style={buttonLike}
      href="/login"
    >
      Login
    </a>
  );
}

function MyAvatar(props: NavbarProps) {
  return (
    <div class="relative" data-te-dropdown-ref>
      <a
        class="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
        href="#"
        id="dropdownMenuButton2"
        role="button"
        data-te-dropdown-toggle-ref
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

function DropdownMenu(props: {
  labelledBy: string;
  menuItems: MenuItemProps[];
}) {
  return (
    <ul
      class="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
      aria-labelledby={props.labelledBy}
      data-te-dropdown-menu-ref
    >
      {props.menuItems.map((menuItem) => <DropdownMenuItem {...menuItem} />)}
    </ul>
  );
}

function DropdownMenuItem(props: MenuItemProps) {
  return (
    <li>
      <a
        class="block w-full whitespace-nowrap bg-transparent py-2 px-4 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
        href={props.url}
        data-te-dropdown-item-ref
      >
        {props.name}
      </a>
    </li>
  );
}
