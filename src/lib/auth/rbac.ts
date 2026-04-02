import { appConfig } from "@/lib/config/app-config";
import type { Permission, UserRole } from "@/types/auth";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ["dashboard:read", "users:read", "projects:read", "tasks:read", "auth:manage"],
  user: ["dashboard:read", "projects:read", "tasks:read"]
};

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (!appConfig.auth.roles.includes(role)) {
    return false;
  }

  if (!appConfig.auth.permissions.includes(permission)) {
    return false;
  }

  return ROLE_PERMISSIONS[role].includes(permission);
}
