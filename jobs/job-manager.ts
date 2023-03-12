import { getLogger } from "$std/log/mod.ts";
import cron from "node-cron";
import { Job } from "./job.ts";

const jobs: Job[] = [];

function logger() {
  return getLogger("jobs");
}

export async function startJob(job: Job) {
  if (job.onStart) {
    await job.onStart();
    logger().info(`job (${job.name}) started`);
  }
  cron.schedule(job.schedule, () => job.run());
  logger().info(`job (${job.name}) scheduled at "${job.schedule}"`);
  jobs.push(job);
}

export async function stopAllJobs() {
  for (let job; (job = jobs.pop()) !== undefined;) {
    if (job.onExit) {
      await job.onExit();
      logger().info(`job (${job.name}) exit`);
    }
  }
}
