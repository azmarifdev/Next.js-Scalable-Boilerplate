"use client";

import { getSession, signIn, signOut } from "next-auth/react";

import type { AuthPayload, AuthResponse } from "@/modules/auth/auth.types";
import type { User } from "@/types/user";

function mapSessionUser(sessionUser: {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  role?: "admin" | "user";
}): User {
  const fallbackId = sessionUser.email ?? sessionUser.name ?? "nextauth-user";

  return {
    id: sessionUser.id ?? fallbackId,
    name: sessionUser.name ?? "Unknown User",
    email: sessionUser.email ?? "unknown@example.com",
    role: sessionUser.role === "admin" ? "admin" : "user"
  };
}

export const nextAuthProvider = {
  async login(payload: AuthPayload): Promise<AuthResponse> {
    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    const session = await getSession();
    if (!session?.user) {
      throw new Error("Unable to create authenticated session");
    }

    return { user: mapSessionUser(session.user) };
  },

  async register(): Promise<AuthResponse> {
    throw new Error("Registration for NextAuth should be handled by your identity provider");
  },

  async getMe(): Promise<User> {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    return mapSessionUser(session.user);
  },

  async logout(): Promise<{ cleared: boolean }> {
    await signOut({ redirect: false });
    return { cleared: true };
  },

  async refreshToken(): Promise<{ refreshed: boolean }> {
    return { refreshed: true };
  }
};
