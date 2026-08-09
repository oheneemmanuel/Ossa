import { DefaultSession } from "next-auth";
import {Role} from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: String;
    firstName: string;
    lastName: string;
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
  }
}