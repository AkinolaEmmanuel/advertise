import type { Request } from "express";

export type JwtPayload = {
  userId: string;
  email: string;
};

export type AuthedRequest = Request & {
  user: JwtPayload;
};
