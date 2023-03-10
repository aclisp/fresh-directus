import { getLogger } from "$std/log/mod.ts";
import cron from "node-cron";
import { Job } from "./job.ts";

const jobs = new Map<string, Job>();

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
  jobs.set(job.name, job);
}

export async function stopAllJobs() {
  const keys: string[] = [];
  for (const key of jobs.keys()) {
    keys.push(key);
  }
  keys.reverse();
  for (const key of keys) {
    const job = jobs.get(key);
    if (job?.onExit) {
      await job.onExit();
      logger().info(`job (${job.name}) exit`);
    }
  }
}
