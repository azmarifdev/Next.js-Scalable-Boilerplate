import { appConfig } from "@/lib/config/app-config";

export type FeatureFlag = keyof typeof appConfig.features;

export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return appConfig.features[feature];
}

export function assertFeatureEnabled(feature: FeatureFlag): void {
  if (!isFeatureEnabled(feature)) {
    throw new Error(`Feature '${feature}' is disabled by configuration`);
  }
}
