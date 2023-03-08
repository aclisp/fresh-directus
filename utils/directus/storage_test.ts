import {
  clearStorage,
  countStorageValues,
  dumpStorage,
  loadStorage,
  setStorageValue,
  STORAGE_FILE,
} from "./storage.ts";
import { assertEquals } from "$std/testing/asserts.ts";

Deno.test("dumpStorage", async () => {
  const now = Date.now();
  for (let i = 0; i < 10; i++) {
    setStorageValue(`${i}`, {
      access_token: `atoken${i}`,
      expires_at: Math.trunc((now + i) / 1000),
      refresh_token: `rtoken${i}`,
    });
  }
  await dumpStorage();

  clearStorage();

  await loadStorage();

  assertEquals(countStorageValues(), 10);
});

Deno.test("loadStorage", async () => {
  try {
    await Deno.remove(STORAGE_FILE);
  } catch (_error) {
    // do nothing
  }

  clearStorage();

  await loadStorage();

  assertEquals(countStorageValues(), 0);
});
