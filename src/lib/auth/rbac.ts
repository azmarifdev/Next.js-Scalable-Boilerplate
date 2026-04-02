import type { Permission, UserRole } from "@/types/auth";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ["dashboard:read", "users:read", "projects:read", "tasks:read", "auth:manage"],
  user: ["dashboard:read", "projects:read", "tasks:read"]
};

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
