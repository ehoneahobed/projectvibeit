import NextAuth from "next-auth"

import { authConfig } from "./auth.config"

declare module "next-auth" {
  interface User {
    id: string
  }
}

declare module "next-auth" {
  interface JWT {
    id: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
