import type { AuthProvider } from "@/lib/auth/auth.provider";
import { betterAuthProvider } from "@/lib/auth/better-auth.provider";

export const customAuthProvider: AuthProvider = {
  ...betterAuthProvider
};
