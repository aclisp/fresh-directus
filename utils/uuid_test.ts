import { randomUUID, uuidToBase64, uuidToBase64Native } from "./uuid.ts";
import { assertEquals } from "$std/testing/asserts.ts";

Deno.test("uuidToBase64", () => {
  for (let i = 0; i < 10; i++) {
    const uuid = crypto.randomUUID();
    const b1 = uuidToBase64(uuid);
    const b2 = uuidToBase64Native(uuid);
    console.log(`${uuid} -> ${b1}`);
    assertEquals(b1, b2);
  }
});

Deno.test("randomUUID", () => {
  for (let i = 0; i < 10; i++) {
    const uuid = randomUUID();
    console.log(`${uuid}`);
  }
});
