import { SessionIdentifier } from "$directus/auth.ts";

export interface State {
  uid: SessionIdentifier;
  accessToken: string;
}
