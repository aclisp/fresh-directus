import { dumpStorage, loadStorage } from "@/utils/directus/storage.ts";
import { Job } from "./job.ts";

export const storageKeeper: Job = {
  name: "storage-keeper",
  schedule: "0,15,30,45 * * * * *",
  run: async () => {
    await dumpStorage();
  },
  onStart: async () => {
    await loadStorage();
  },
  onExit: async () => {
    await dumpStorage();
  },
};
