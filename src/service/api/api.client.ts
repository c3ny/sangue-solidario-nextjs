import { IAPIResponse, IAPIRequestOptions, isAPISuccess, isAPIError } from "./api";
import { BaseAPIClient } from "./base-api-client";
import { getClientUrl } from "@/config/microservices";

export type { IAPIResponse, IAPIRequestOptions };
export { isAPISuccess, isAPIError };

/**
 * Client-side API service. Uses NEXT_PUBLIC_ env vars via getClientUrl().
 * Extends BaseAPIClient for shared HTTP methods.
 */
export class APIClient extends BaseAPIClient {
  public getDonationServiceUrl(path: string): string {
    return getClientUrl("donation", path);
  }

  public getUsersServiceUrl(path: string): string {
    return getClientUrl("users", path);
  }

  public getBloodStockServiceUrl(path: string): string {
    return getClientUrl("bloodStock", path);
  }

  public getCdnServiceUrl(path: string): string {
    return getClientUrl("cdn", path);
  }

  public isAuthenticated(): boolean {
    return this.authToken !== null;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }
}

export const apiClient = new APIClient();
