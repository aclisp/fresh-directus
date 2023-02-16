import IconChevronLeft from "tabler-icons/chevron-left.tsx";
import IconCirclePlus from "tabler-icons/circle-plus.tsx";
import IconUser from "tabler-icons/user.tsx";
import IconBrandSafari from "tabler-icons/brand-safari.tsx";
import IconAddressBook from "tabler-icons/address-book.tsx";
import IconMessageCircle2 from "tabler-icons/message-circle-2.tsx";

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

      <div class="w-full flex flex-col gap-4 p-4">
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
        <div class="bg-blue-500 h-16"></div>
      </div>

      <Footer />
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
          <div class="flex justify-center">
            <h1>{props.name}</h1>
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
      <a class="block px-4" href="#back">
        <Icon class="w-6 h-6 stroke-[1.5]" />
      </a>
    </div>
  );
}

function HeaderRightItem(props: { icon: IconEnum }) {
  const Icon = icons[props.icon];
  return (
    <div class="absolute inset-y-0 right-0">
      <a class="block px-4" href="#func">
        <Icon class="w-6 h-6 stroke-[1.5]" />
      </a>
    </div>
  );
}

function Footer() {
  return (
    <>
      {/* Footer Placeholder */}
      <div class="w-full h-16"></div>
      {/* Footer */}
      <div
        class="fixed bottom-0 bg-slate-100 h-16 flex justify-around items-center"
        style="width: inherit; max-width: inherit"
      >
        <FooterTabItem url="#chat" name="微信" icon="chat" />
        <FooterTabItem url="#address" name="通讯录" icon="address" />
        <FooterTabItem url="#explore" name="发现" icon="explore" />
        <FooterTabItem url="#me" name="我" icon="user" />
      </div>
    </>
  );
}

function FooterTabItem(props: {
  url: string;
  name: string;
  icon: IconEnum;
}) {
  const Icon = icons[props.icon];
  return (
    <a href={props.url} class="px-4">
      <div class="flex flex-col items-center">
        {/* Icon */}
        <Icon class="w-8 h-8 stroke-[1.5]" />
        {/* Text */}
        <p class="text-xs">{props.name}</p>
      </div>
    </a>
  );
}
