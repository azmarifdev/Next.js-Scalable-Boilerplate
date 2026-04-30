import type { AuthProvider } from "@/lib/auth/auth.provider";
import { customAuthAdapter } from "@/modules/optional/auth/custom-auth.adapter";

export const customAuthProvider: AuthProvider = {
  ...customAuthAdapter
};
