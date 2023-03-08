import jwt, { JwtPayload } from "jsonwebtoken";

export function jwtDecode(token: string): JwtPayload {
  return jwt.decode(token) as JwtPayload;
}
