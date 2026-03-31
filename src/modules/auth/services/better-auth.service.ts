import { authService } from "@/modules/auth/services/auth.service";

// Optional adapter point for teams that prefer `better-auth` over NextAuth.
// Keep app-level consumers dependent on this interface for easy provider swap.
export const betterAuthService = {
  login: authService.login,
  register: authService.register,
  logout: authService.logout,
  getMe: authService.getMe
};
