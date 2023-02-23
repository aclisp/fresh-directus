import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link
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
      </Head>
      <Component />
    </>
  );
}
