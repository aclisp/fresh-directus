import IconChevronLeft from "tabler-icons/chevron-left.tsx";
import IconCirclePlus from "tabler-icons/circle-plus.tsx";

export default function Explore() {
  return (
    <div class="flex flex-col w-full sm:max-w-screen-sm mx-auto">
      {/* Header */}
      <div
        class="fixed top-0 bg-slate-200 h-14 flex items-center"
        style="width: inherit; max-width: inherit"
      >
        <div class="relative grow">
          {/* Left part */}
          <div class="absolute inset-y-0 left-0">
            <a class="block px-4" href="#back">
              <IconChevronLeft class="w-6 h-6 stroke-[1.5]" />
            </a>
          </div>
          {/* Title */}
          <div class="flex justify-center">
            <h1>Contacts</h1>
          </div>
          {/* Right part */}
          <div class="absolute inset-y-0 right-0">
            <a class="block px-4" href="#func">
              <IconCirclePlus class="w-6 h-6 stroke-[1.5]" />
            </a>
          </div>
        </div>
      </div>
      {/* Header Placeholder */}
      <div class="w-full h-14"></div>

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

      {/* Footer Placeholder */}
      <div class="w-full h-16"></div>
      {/* Footer */}
      <div
        class="fixed bottom-0 bg-slate-200 h-16 flex justify-around"
        style="width: inherit; max-width: inherit"
      >
        <a href="#1">1</a>
        <a href="#2">2</a>
        <a href="#3">3</a>
        <a href="#4">4</a>
      </div>
    </div>
  );
}
