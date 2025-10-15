"use client";

import React, {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import { IFeatureFlags } from "@/interfaces/FeatureFlags.interface";
import { getFeatureFlags } from "@/service/featureFlags/featureFlags.config";

/**
 * Feature flags context interface
 */
interface IFeatureFlagsContext {
  /**
   * All feature flags
   */
  flags: IFeatureFlags;

  /**
   * Check if a specific feature is enabled
   */
  isEnabled: (feature: keyof IFeatureFlags) => boolean;
}

/**
 * Feature flags context
 */
const FeatureFlagsContext = createContext<IFeatureFlagsContext | undefined>(
  undefined
);

/**
 * Feature flags provider props
 */
interface IFeatureFlagsProviderProps {
  /**
   * Override feature flags for testing or specific use cases
   */
  overrides?: Partial<IFeatureFlags>;
}

/**
 * Feature flags provider
 * Provides feature flags to all components in the tree
 */
export const FeatureFlagsProvider = ({
  children,
  overrides,
}: PropsWithChildren<IFeatureFlagsProviderProps>) => {
  const flags = React.useMemo(() => {
    const defaultFlags = getFeatureFlags();
    return overrides ? { ...defaultFlags, ...overrides } : defaultFlags;
  }, [overrides]);

  const isEnabled = React.useCallback(
    (feature: keyof IFeatureFlags) => {
      return flags[feature];
    },
    [flags]
  );

  const value = React.useMemo(
    () => ({
      flags,
      isEnabled,
    }),
    [flags, isEnabled]
  );

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

/**
 * Hook to access feature flags
 * @throws {Error} If used outside of FeatureFlagsProvider
 */
export const useFeatureFlags = (): IFeatureFlagsContext => {
  const context = useContext(FeatureFlagsContext);

  if (context === undefined) {
    throw new Error(
      "useFeatureFlags must be used within a FeatureFlagsProvider"
    );
  }

  return context;
};
