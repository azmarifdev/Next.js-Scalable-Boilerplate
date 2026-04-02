import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { findAuthUserByEmail, isAuthDatabaseConfigured } from "@/lib/auth-user.repository";
import { appConfig } from "@/lib/config/app-config";
import { tryDevAuthLogin } from "@/lib/dev-auth-fallback";
import { env } from "@/lib/env";
import { verifyPassword } from "@/lib/password";

const providers: Provider[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      const email = String(credentials?.email ?? "").toLowerCase();
      const password = String(credentials?.password ?? "");

      if (!email || !password) {
        return null;
      }

      if (isAuthDatabaseConfigured()) {
        const user = await findAuthUserByEmail(email);
        if (!user) {
          return null;
        }

        const isValidPassword = await verifyPassword(password, user.passwordHash);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }

      const fallbackResult = await tryDevAuthLogin({ email, password });
      if (!fallbackResult.user) {
        return null;
      }

      return {
        id: fallbackResult.user.id,
        name: fallbackResult.user.name,
        email: fallbackResult.user.email,
        role: fallbackResult.user.role
      };
    }
  })
];

if (env.AUTH_GOOGLE_CLIENT_ID && env.AUTH_GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "user";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.sub ?? "");
        session.user.role = token.role === "admin" ? "admin" : "user";
      }

      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  trustHost: true,
  debug: process.env.NODE_ENV !== "production"
});

export function isNextAuthEnabled(): boolean {
  return appConfig.authProvider === "nextauth";
}
