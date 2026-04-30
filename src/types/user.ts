import type { UserRole } from "@/types/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mfaVerified?: boolean;
  mfaRequired?: boolean;
}
