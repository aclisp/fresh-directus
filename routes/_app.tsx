import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>在线工具箱</title>
        {
          /* <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tw-elements/dist/css/index.min.css"
        />
        <script src="https://cdn.tailwindcss.com/3.2.4"></script>
        <script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js">
        </script>
        */
        }

        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com/3.2.6?plugins=forms"></script>
      </Head>
      <Component />
    </>
  );
}
