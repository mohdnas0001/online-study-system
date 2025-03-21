// next-auth.d.ts
import  { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
    accessToken: string; // Required accessToken
  }

  interface User {
    id: string;
    role?: string;
    accessToken: string; // Add accessToken to User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    accessToken: string; // Add accessToken to JWT
  }
}