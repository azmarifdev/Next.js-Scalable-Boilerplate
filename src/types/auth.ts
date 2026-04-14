export type UserRole = "admin" | "user";

export type Permission =
  | "dashboard:read"
  | "users:read"
  | "projects:read"
  | "tasks:read"
  | "ecommerce:read"
  | "billing:read"
  | "auth:manage";

export const roles: UserRole[] = ["admin", "user"];
export const permissions: Permission[] = [
  "dashboard:read",
  "users:read",
  "projects:read",
  "tasks:read",
  "ecommerce:read",
  "billing:read",
  "auth:manage"
];
