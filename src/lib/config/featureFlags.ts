import { appConfig } from "@/lib/config/app-config";

export type FeatureFlag = "ENABLE_ADMIN" | "ENABLE_CUSTOM_AUTH";

export type FeatureFlagCategory = "auth-modes" | "optional-modules" | "dev-features";

export interface FeatureFlagDefinition {
  key: FeatureFlag;
  label: string;
  category: FeatureFlagCategory;
}

export const featureFlagDefinitions: FeatureFlagDefinition[] = [
  { key: "ENABLE_CUSTOM_AUTH", label: "Optional Custom Auth Module", category: "auth-modes" },
  { key: "ENABLE_ADMIN", label: "Admin Module", category: "optional-modules" }
];

export type FeatureFlags = Record<FeatureFlag, boolean>;

export function getFeatureFlags(): FeatureFlags {
  return {
    ENABLE_ADMIN: appConfig.features.admin,
    ENABLE_CUSTOM_AUTH:
      process.env.NEXT_PUBLIC_ENABLE_CUSTOM_AUTH === "true" ||
      process.env.ENABLE_CUSTOM_AUTH === "true"
  };
}

export const featureFlags: FeatureFlags = getFeatureFlags();

export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return getFeatureFlags()[feature];
}

export function assertFeatureEnabled(feature: FeatureFlag): void {
  if (!isFeatureEnabled(feature)) {
    throw new Error(`Feature '${feature}' is disabled by configuration`);
  }
}

export const LOCAL_FEATURE_FLAGS_STORAGE_KEY = "dev.feature.flags";

export function readLocalFeatureFlagOverrides(): Partial<FeatureFlags> {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(LOCAL_FEATURE_FLAGS_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FeatureFlags>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function writeLocalFeatureFlagOverrides(overrides: Partial<FeatureFlags>): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(overrides));
}

export function resolveClientFeatureFlags(overrides: Partial<FeatureFlags>): FeatureFlags {
  const server = getFeatureFlags();
  return {
    ...server,
    ...overrides
  };
}
