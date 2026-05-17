"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import {
  FeatureFlags,
  getFeatureFlags,
  readLocalFeatureFlagOverrides,
  resolveClientFeatureFlags
} from "@/lib/config/featureFlags";

const FeatureFlagsContext = createContext<FeatureFlags | null>(null);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(getFeatureFlags());

  useEffect(() => {
    const overrides = readLocalFeatureFlagOverrides();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlags(resolveClientFeatureFlags(overrides));
  }, []);

  return <FeatureFlagsContext.Provider value={flags}>{children}</FeatureFlagsContext.Provider>;
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    return getFeatureFlags();
  }
  return context;
}
