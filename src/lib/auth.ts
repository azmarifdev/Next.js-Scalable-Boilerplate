import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID ?? "",
      clientSecret: env.GITHUB_CLIENT_SECRET ?? ""
    })
  ],
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  }
};
