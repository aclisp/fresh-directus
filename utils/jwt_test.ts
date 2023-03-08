import { jwtDecode } from "./jwt.ts";
import { assertEquals } from "$std/testing/asserts.ts";

Deno.test("jwtDecode", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJiOTg2NWY2LTVmOTUtNDA4Ny04ODMwLTM5OTdhZWZjMjY0MiIsInJvbGUiOiI3YzBkMjQwMC0yMWUwLTQ4MGYtODRhNy00YmM5ZmFmMDY4ZTQiLCJhcHBfYWNjZXNzIjoxLCJhZG1pbl9hY2Nlc3MiOjEsImlhdCI6MTY3ODI0MzUzMiwiZXhwIjoxNjc4MjQzNTkyLCJpc3MiOiJkaXJlY3R1cyJ9.MyHellEJI-dpSYTo0IHkI-Ir1iCr583HkrEs1E1xmsY";
  const decoded = jwtDecode(token);
  assertEquals(decoded.exp, 1678243592);
});
