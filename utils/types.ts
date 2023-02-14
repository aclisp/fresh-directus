import { SessionIdentifier } from "@/utils/directus/auth.ts";

export interface State {
  uid: SessionIdentifier;
  accessToken: string;
}
