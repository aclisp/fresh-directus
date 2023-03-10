/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

//import twindPlugin from "$fresh/plugins/twind.ts";
//import twindConfig from "./twind.config.ts";

import * as log from "$std/log/mod.ts";
import { format } from "$std/datetime/mod.ts";
import { startJob, stopAllJobs } from "@/jobs/job-manager.ts";
import { storageKeeper } from "@/jobs/storage-keeper.ts";

log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: (r) =>
        `${
          format(r.datetime, "MMdd HH:mm:ss.SSS")
        } ${r.levelName} [${r.loggerName}] ${r.msg}`,
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
    "jobs": {
      level: "INFO",
      handlers: ["console"],
    },
    "routes/sub": {
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

await startJob(storageKeeper);
async function onExit() {
  await stopAllJobs();
  log.debug("Bye~");
  Deno.exit();
}
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP", "SIGQUIT"]) {
  Deno.addSignalListener(signal as Deno.Signal, onExit);
}

await start(manifest /*{ plugins: [twindPlugin(twindConfig)] }*/);
