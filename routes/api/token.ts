import { Handlers } from "$fresh/server.ts";
import { State } from "@/utils/types.ts";

export const handler: Handlers<unknown, State> = {
  GET(_req, ctx) {
    const { accessToken } = ctx.state;
    return new Response(accessToken);
  },
};
