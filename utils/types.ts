import { SessionIdentifier } from "@/utils/directus/auth.ts";

export interface State {
  sessionId: SessionIdentifier;
  accessToken: string;
}
