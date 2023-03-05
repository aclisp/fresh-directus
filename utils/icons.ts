import IconChevronLeft from "tabler-icons/chevron-left.tsx";
import IconChevronRight from "tabler-icons/chevron-right.tsx";
import IconCirclePlus from "tabler-icons/circle-plus.tsx";
import IconUser from "tabler-icons/user.tsx";
import IconBrandSafari from "tabler-icons/brand-safari.tsx";
import IconAddressBook from "tabler-icons/address-book.tsx";
import IconMessageCircle2 from "tabler-icons/message-circle-2.tsx";
import IconLogout from "tabler-icons/logout.tsx";
import IconLogin from "tabler-icons/login.tsx";
import IconCircleCheck from "tabler-icons/circle-check.tsx";
import IconAlertCircle from "tabler-icons/alert-circle.tsx";
import IconInfoCircle from "tabler-icons/info-circle.tsx";

export const icons = {
  back: IconChevronLeft,
  href: IconChevronRight,
  plus: IconCirclePlus,
  user: IconUser,
  explore: IconBrandSafari,
  address: IconAddressBook,
  chat: IconMessageCircle2,
  logout: IconLogout,
  login: IconLogin,
  check: IconCircleCheck,
  alert: IconAlertCircle,
  info: IconInfoCircle,
};

export type IconEnum = keyof typeof icons;
