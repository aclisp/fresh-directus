import { getLogger } from "$std/log/mod.ts";
import { LoginInfo, SessionIdentifier } from "./auth.ts";

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

export function listStorageValues(): Array<[SessionIdentifier, StorageValue]> {
  const result = [] as Array<[SessionIdentifier, StorageValue]>;
  storage.forEach((value, uid) => {
    result.push([uid, value]);
  });
  return result;
}

export function delStorageValue(uid: SessionIdentifier) {
  storage.delete(uid);
}
