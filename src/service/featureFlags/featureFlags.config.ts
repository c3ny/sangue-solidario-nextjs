import { IFeatureFlags } from "@/interfaces/FeatureFlags.interface";

export const featureFlagsConfig: IFeatureFlags = {
  blog:
    process.env.NEXT_PUBLIC_FEATURE_BLOG !== undefined
      ? process.env.NEXT_PUBLIC_FEATURE_BLOG === "true"
      : false,
  aboutUs:
    process.env.NEXT_PUBLIC_FEATURE_ABOUT_US !== undefined
      ? process.env.NEXT_PUBLIC_FEATURE_ABOUT_US === "true"
      : true,
};

export const getFeatureFlags = (): IFeatureFlags => {
  return featureFlagsConfig;
};

export const isFeatureEnabled = (feature: keyof IFeatureFlags): boolean => {
  return featureFlagsConfig[feature];
};
