import { useEffect } from "preact/hooks";

export default function ScriptFooter() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.js";
    document.body.appendChild(script);
  }, []);
  return <div></div>;
}
