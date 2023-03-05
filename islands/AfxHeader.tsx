import { IconEnum, icons } from "@/utils/icons.ts";

export default function AfxHeader(props: {
  name: string;
  icon?: IconEnum;
  url?: string;
  placeholder?: boolean;
}) {
  return (
    <>
      {/* Header */}
      <div
        class="fixed top-0 bg-gray-100 h-14 flex items-center"
        style="width: inherit; max-width: inherit"
      >
        <div class="relative grow">
          {/* Left part */}
          <HeaderLeftItem icon="back" />
          {/* Title */}
          <div class="flex justify-center py-2">
            <div class="font-medium">{props.name}</div>
          </div>
          {/* Right part */}
          {props.icon &&
            <HeaderRightItem icon={props.icon} url={props.url!} />}
        </div>
      </div>
      {/* Header Placeholder */}
      {props.placeholder && <div class="w-full h-14"></div>}
    </>
  );
}

function HeaderLeftItem(props: { icon: IconEnum }) {
  const Icon = icons[props.icon];
  return (
    <div class="absolute inset-y-0 left-0">
      <a
        class="block px-4 py-2"
        onClick={() => {
          history.back();
        }}
      >
        <Icon class="w-6 h-6 stroke-[1.5]" />
      </a>
    </div>
  );
}

function HeaderRightItem(props: { icon: IconEnum; url: string }) {
  const Icon = icons[props.icon];
  return (
    <div class="absolute inset-y-0 right-0">
      <a class="block px-4 py-2" href={props.url}>
        <Icon class="w-6 h-6 stroke-[1.5]" />
      </a>
    </div>
  );
}
