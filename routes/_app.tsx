import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Planar Sphere</title>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@2.51.3/dist/full.css"
          rel="stylesheet"
          type="text/css"
        />
        <script src="https://cdn.tailwindcss.com/3.2.6?plugins=forms"></script>
      </Head>
      <Component />
    </>
  );
}
