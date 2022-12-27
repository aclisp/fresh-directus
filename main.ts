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
import { dumpStorage, loadStorage, shrinkStorage } from "$directus/storage.ts";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: (r) =>
        `${
          format(r.datetime, "yyyy-MM-dd HH:mm:ss.SSS")
        } ${r.levelName} [${r.loggerName}] ${r.msg}`,
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
    "routes/login": {
      level: "DEBUG",
      handlers: ["console"],
    },
    "directus/transport": {
      level: "DEBUG",
      handlers: ["console"],
    },
    "directus/storage": {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

await loadStorage();

async function onExit() {
  await dumpStorage();
  log.debug("Bye~");
  Deno.exit();
}

for (
  const signal of [
    "SIGINT",
    "SIGTERM",
    "SIGHUP",
    "SIGQUIT",
  ]
) {
  Deno.addSignalListener(signal as Deno.Signal, onExit);
}

setInterval(() => {
  shrinkStorage();
}, 60000);

await start(manifest, { plugins: [twindPlugin(twindConfig)] });
