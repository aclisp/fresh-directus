// deno-lint-ignore no-explicit-any
let v: any;

const closure1 = () => {
  console.log(`closure1 - v=${v}`);
};

const setv = () => {
  v = "def";
};

Deno.test("closure1", () => {
  closure1();
  setv();
  closure1();
});
