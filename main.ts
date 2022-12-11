/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

import * as log from "$std/log/mod.ts";
import { format } from "$std/datetime/mod.ts";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: (r) =>
        `${
          format(r.datetime, "yyyy-MM-dd HH:mm:ss.SSS")
        } ${r.levelName} ${r.msg}`,
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

await start(manifest, { plugins: [twindPlugin(twindConfig)] });
