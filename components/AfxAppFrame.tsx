import { ComponentChildren } from "preact";

export function AfxAppFrame(props: { children: ComponentChildren }) {
  return (
    <div class="flex flex-col w-full sm:max-w-screen-sm mx-auto">
      {props.children}
    </div>
  );
}
