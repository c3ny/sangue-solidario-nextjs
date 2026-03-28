export interface IFeatureFlags {
  /**
   * Controls the visibility of the Blog section on the home page
   */
  blog: boolean;

  /**
   * Controls the visibility of the About Us section on the home page
   */
  aboutUs: boolean;

  /**
   * Controls the visibility of the Campanhas page.
   * Disabled until campaign-service API is ready.
   */
  campaigns: boolean;

  /**
   * Controls the visibility of the Appointments section in the hemocentros dashboard.
   * Disabled until appointments API is ready.
   */
  appointments: boolean;
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
