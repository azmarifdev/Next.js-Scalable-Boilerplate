export type UserRole = "admin" | "user";

export type Permission =
  | "dashboard:read"
  | "users:read"
  | "projects:read"
  | "tasks:read"
  | "auth:manage";
