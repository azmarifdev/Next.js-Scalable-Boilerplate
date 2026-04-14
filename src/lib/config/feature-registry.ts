import type { FeatureFlag } from "@/lib/config/feature-flags";
import type { Permission } from "@/types/auth";

export interface FeatureDefinition {
  key: FeatureFlag;
  route: string;
  permission: Permission;
  navLabelKey: string;
  requiresRole?: "admin" | "user";
}

export const featureRegistry: FeatureDefinition[] = [
  {
    key: "admin",
    route: "/users",
    permission: "users:read",
    navLabelKey: "usersNav",
    requiresRole: "admin"
  },
  {
    key: "ecommerce",
    route: "/ecommerce",
    permission: "ecommerce:read",
    navLabelKey: "ecommerceNav"
  },
  {
    key: "billing",
    route: "/billing",
    permission: "billing:read",
    navLabelKey: "billingNav"
  }
];

export function findFeatureByPath(pathname: string): FeatureDefinition | undefined {
  return featureRegistry.find(
    (feature) => pathname === feature.route || pathname.startsWith(`${feature.route}/`)
  );
}
