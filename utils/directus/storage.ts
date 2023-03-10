import { getLogger } from "$std/log/mod.ts";
import { readLines } from "$std/io/read_lines.ts";
import { SessionIdentifier } from "./auth.ts";

export const STORAGE_FILE = "storage.txt";

export interface StorageValue {
  access_token: string;
  refresh_token: string;
  /** UTC seconds when this value expires */
  expires_at: number;
}

const storage = new Map<SessionIdentifier, StorageValue>();

function _logger() {
  return getLogger("directus/storage");
}

export function setStorageValue(
  sessionId: SessionIdentifier,
  value: StorageValue,
) {
  storage.set(sessionId, value);
}

export function getStorageValue(
  sessionId: SessionIdentifier,
): StorageValue | undefined {
  return storage.get(sessionId);
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
  for (const [sid, value] of storage) {
    if (index++ >= from) {
      result.push([sid, value]);
    }
  }
  return result;
}

export function countStorageValues(): number {
  return storage.size;
}

export function delStorageValue(sessionId: SessionIdentifier) {
  storage.delete(sessionId);
}

export function shrinkStorage() {
  const now = Date.now();
  for (const [sid, value] of storage) {
    if (stale(value, now)) {
      storage.delete(sid);
    }
  }
}

function stale(value: StorageValue, now: number): boolean {
  return value.expires_at * 1000 < now - 30000;
}

export async function dumpStorage() {
  shrinkStorage();

  const file = await Deno.open(STORAGE_FILE, {
    write: true,
    create: true,
    truncate: true,
  });
  for (const [sid, value] of storage) {
    const str = JSON.stringify({ sid, value });
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
      storage.set(json.sid, json.value);
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
