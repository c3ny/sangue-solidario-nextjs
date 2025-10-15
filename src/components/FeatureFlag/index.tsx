"use client";

import { type PropsWithChildren } from "react";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { IFeatureFlags } from "@/interfaces/FeatureFlags.interface";

export interface IFeatureFlagProps {
  /**
   * Feature flag name to check
   */
  feature: keyof IFeatureFlags;

  /**
   * Optional fallback content to render when feature is disabled
   */
  fallback?: React.ReactNode;
}

/**
 * Feature flag component
 * Conditionally renders children based on feature flag status
 *
 * @example
 * ```tsx
 * <FeatureFlag feature="blog">
 *   <BlogSection />
 * </FeatureFlag>
 * ```
 */
export const FeatureFlag = ({
  feature,
  children,
  fallback = null,
}: PropsWithChildren<IFeatureFlagProps>) => {
  const { isEnabled } = useFeatureFlags();

  if (!isEnabled(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
