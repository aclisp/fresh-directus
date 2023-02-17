import IconChevronLeft from "tabler-icons/chevron-left.tsx";
import IconChevronRight from "tabler-icons/chevron-right.tsx";
import IconCirclePlus from "tabler-icons/circle-plus.tsx";
import IconUser from "tabler-icons/user.tsx";
import IconBrandSafari from "tabler-icons/brand-safari.tsx";
import IconAddressBook from "tabler-icons/address-book.tsx";
import IconMessageCircle2 from "tabler-icons/message-circle-2.tsx";
import { ComponentChildren } from "preact";

const icons = {
  back: IconChevronLeft,
  plus: IconCirclePlus,
  user: IconUser,
  explore: IconBrandSafari,
  address: IconAddressBook,
  chat: IconMessageCircle2,
};

type IconEnum = keyof typeof icons;

export default function Explore() {
  return (
    <div class="flex flex-col w-full sm:max-w-screen-sm mx-auto">
      <Header left="back" name="通讯录" right="plus" />

      <div class="w-full flex flex-col gap-2.5 bg-slate-100 border-b-1">
        <ListGroup>
          <ListItem name="服务" />
        </ListGroup>
        <ListGroup>
          <ListItem name="收藏" url="#" />
          <ListItem name="朋友圈" value="有新内容" />
          <ListItem name="视频号" value="直播中" />
          <ListItem name="卡包" value="需要充值" url="#" />
          <ListItem name="表情" value="上新" url="#" />
        </ListGroup>
        <ListGroup>
          <ListItem name="设置" />
        </ListGroup>
      </div>

      <Footer />
    </div>
  );
}

function ListItem(props: {
  name: string;
  value?: string;
  url?: string;
}) {
  if (props.url) {
    return (
      <a href="#" class="block pl-4 pr-2 py-4">
        <div class="flex justify-between">
          <div>
            {props.name}
          </div>
          <div class="flex">
            <div class="text-gray-500">
              {props.value}
            </div>
            <IconChevronRight class="stroke-gray-400 ml-1 stroke-[1.5]" />
          </div>
        </div>
      </a>
    );
  } else {
    return (
      <div class="pl-4 pr-9 py-4">
        <div class="flex justify-between">
          <div>
            {props.name}
          </div>
          <div class="text-gray-500">
            {props.value}
          </div>
        </div>
      </div>
    );
  }
}

function ListGroup(props: { children: ComponentChildren }) {
  return (
    <div class="bg-white border-0 border-slate-100 divide-y">
      {props.children}
    </div>
  );
}

function Header(props: {
  name: string;
  left: IconEnum;
  right: IconEnum;
}) {
  return (
    <>
      {/* Header */}
      <div
        class="fixed top-0 bg-slate-100 h-14 flex items-center"
        style="width: inherit; max-width: inherit"
      >
        <div class="relative grow">
          {/* Left part */}
          <HeaderLeftItem icon={props.left} />
          {/* Title */}
          <div class="flex justify-center py-2">
            <h1 class="font-medium">{props.name}</h1>
          </div>
          {/* Right part */}
          <HeaderRightItem icon={props.right} />
        </div>
      </div>
      {/* Header Placeholder */}
      <div class="w-full h-14"></div>
    </>
  );
}

function HeaderLeftItem(props: { icon: IconEnum }) {
  const Icon = icons[props.icon];
  return (
    <div class="absolute inset-y-0 left-0">
      <a class="block px-4 py-2" href="#back">
        <Icon class="w-6 h-6 stroke-[1.5]" />
      </a>
    </div>
  );
}

function HeaderRightItem(props: { icon: IconEnum }) {
  const Icon = icons[props.icon];
  return (
    <div class="absolute inset-y-0 right-0">
      <a class="block px-4 py-2" href="#func">
        <Icon class="w-6 h-6 stroke-[1.5]" />
      </a>
    </div>
  );
}

function Footer() {
  return (
    <>
      {/* Footer Placeholder */}
      <div class="w-full h-14"></div>
      {/* Footer */}
      <div
        class="fixed bottom-0 bg-slate-100 h-14 flex justify-around items-center"
        style="width: inherit; max-width: inherit"
      >
        <FooterTabItem url="#chat" name="微信" icon="chat" active />
        <FooterTabItem url="#address" name="通讯录" icon="address" />
        <FooterTabItem url="#explore" name="发现" icon="explore" />
        <FooterTabItem url="#me" name="我" icon="user" active />
      </div>
    </>
  );
}

function FooterTabItem(props: {
  url: string;
  name: string;
  icon: IconEnum;
  active?: boolean;
}) {
  const Icon = icons[props.icon];
  return (
    <a href={props.url} class="px-4">
      <div class="flex flex-col items-center">
        {/* Icon */}
        <Icon
          class={`w-7 h-7 stroke-1 ${
            props.active ? "fill-green-500 stroke-green-500" : ""
          }`}
        />
        {/* Text */}
        <p class={`text-[0.6rem] ${props.active ? "text-green-500" : ""}`}>
          {props.name}
        </p>
      </div>
    </a>
  );
}
