// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[name].tsx";
import * as $1 from "./routes/_app.tsx";
import * as $2 from "./routes/_middleware.ts";
import * as $3 from "./routes/api/joke.ts";
import * as $4 from "./routes/api/token.ts";
import * as $5 from "./routes/debug/explore.tsx";
import * as $6 from "./routes/debug/formula.tsx";
import * as $7 from "./routes/debug/play.tsx";
import * as $8 from "./routes/debug/storage.tsx";
import * as $9 from "./routes/del__login.tsx";
import * as $10 from "./routes/index.tsx";
import * as $11 from "./routes/login.tsx";
import * as $12 from "./routes/profile.tsx";
import * as $13 from "./routes/sub.tsx";
import * as $$0 from "./islands/Channel.tsx";
import * as $$1 from "./islands/Counter.tsx";
import * as $$2 from "./islands/FormulaCalculator.tsx";

const manifest = {
  routes: {
    "./routes/[name].tsx": $0,
    "./routes/_app.tsx": $1,
    "./routes/_middleware.ts": $2,
    "./routes/api/joke.ts": $3,
    "./routes/api/token.ts": $4,
    "./routes/debug/explore.tsx": $5,
    "./routes/debug/formula.tsx": $6,
    "./routes/debug/play.tsx": $7,
    "./routes/debug/storage.tsx": $8,
    "./routes/del__login.tsx": $9,
    "./routes/index.tsx": $10,
    "./routes/login.tsx": $11,
    "./routes/profile.tsx": $12,
    "./routes/sub.tsx": $13,
  },
  islands: {
    "./islands/Channel.tsx": $$0,
    "./islands/Counter.tsx": $$1,
    "./islands/FormulaCalculator.tsx": $$2,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
