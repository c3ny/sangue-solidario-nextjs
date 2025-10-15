export interface IFeatureFlags {
  /**
   * Controls the visibility of the Blog section on the home page
   */
  blog: boolean;

  /**
   * Controls the visibility of the About Us section on the home page
   */
  aboutUs: boolean;
}

/**
 * Configuration for feature flags
 * Can be extended with additional metadata like rollout percentage, user segments, etc.
 */
export interface IFeatureFlagConfig {
  /**
   * Flag name
   */
  name: keyof IFeatureFlags;

  /**
   * Flag description
   */
  description: string;

  /**
   * Current value
   */
  enabled: boolean;

  /**
   * Default value if not specified
   */
  defaultValue: boolean;
}
