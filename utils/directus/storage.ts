import { getLogger } from "$std/log/mod.ts";
import { readLines } from "$std/io/mod.ts";
import { LoginInfo, SessionIdentifier } from "./auth.ts";

export const STORAGE_FILE = "storage.txt";

export interface StorageValue extends LoginInfo {
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

const storage = new Map<SessionIdentifier, StorageValue>();

function logger() {
  return getLogger("directus/storage");
}

export function setStorageValue(uid: SessionIdentifier, value: StorageValue) {
  storage.set(uid, value);
}

export function getStorageValue(
  uid: SessionIdentifier,
): StorageValue | undefined {
  logger().debug(`getStorageValue: ${uid}`);
  return storage.get(uid);
}

export function listStorageValues(
  limit = 20,
): Array<[SessionIdentifier, StorageValue]> {
  const result = [] as Array<[SessionIdentifier, StorageValue]>;
  let from = storage.size - limit;
  if (from < 0) {
    from = 0;
  }
  let index = 0;
  for (const [uid, value] of storage) {
    if (index++ >= from) {
      result.push([uid, value]);
    }
  }
  return result;
}

export function countStorageValues(): number {
  return storage.size;
}

export function delStorageValue(uid: SessionIdentifier) {
  storage.delete(uid);
}

export function shrinkStorage() {
  const now = Date.now();
  for (const [uid, value] of storage) {
    if (stale(value, now)) {
      storage.delete(uid);
    }
  }
}

function stale(value: StorageValue, now: number): boolean {
  return value.refreshTokenExpiresAt < now - 30000;
}

export async function dumpStorage() {
  shrinkStorage();

  const file = await Deno.open(STORAGE_FILE, {
    write: true,
    create: true,
    truncate: true,
  });
  for (const [uid, value] of storage) {
    const str = JSON.stringify({ uid, value });
    const encoder = new TextEncoder();
    const data = encoder.encode(str + "\n");
    await file.write(data);
  }
  file.close();
}

export async function loadStorage() {
  try {
    const file = await Deno.open(STORAGE_FILE, { read: true });
    for await (const line of readLines(file)) {
      const json = JSON.parse(line);
      storage.set(json.uid, json.value);
    }
    file.close();

    shrinkStorage();
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // do nothing
    } else {
      throw error;
    }
  }
}

export function clearStorage() {
  storage.clear();
}
