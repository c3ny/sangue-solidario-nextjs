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
  campaigns:
    process.env.NEXT_PUBLIC_FEATURE_CAMPAIGNS !== undefined
      ? process.env.NEXT_PUBLIC_FEATURE_CAMPAIGNS === "true"
      : false,
  appointments:
    process.env.NEXT_PUBLIC_FEATURE_APPOINTMENTS !== undefined
      ? process.env.NEXT_PUBLIC_FEATURE_APPOINTMENTS === "true"
      : false,
};

export const getFeatureFlags = (): IFeatureFlags => {
  return featureFlagsConfig;
};

export const isFeatureEnabled = (feature: keyof IFeatureFlags): boolean => {
  return featureFlagsConfig[feature];
};
