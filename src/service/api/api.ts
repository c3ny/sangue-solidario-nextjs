import { BaseAPIClient } from "./base-api-client";

export interface IAPIErrorResponse {
  status: number;
  message: string;
  error?: string;
}

export interface IAPISuccessResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

export type IAPIResponse<T = unknown> =
  | IAPISuccessResponse<T>
  | IAPIErrorResponse;

export function isAPIError(
  response: IAPIResponse
): response is IAPIErrorResponse {
  return "error" in response || response.status >= 400;
}

export function isAPISuccess<T>(
  response: IAPIResponse<T>
): response is IAPISuccessResponse<T> {
  return !isAPIError(response);
}

export interface IAPIRequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  token?: string;
}

/**
 * Server-side API service. Uses server-side env vars (without NEXT_PUBLIC_).
 * Extends BaseAPIClient for shared HTTP methods.
 */
export class APIService extends BaseAPIClient {
  private readonly DONATION_SERVICE_URL =
    process.env.DONATION_SERVICE_URL ||
    process.env.NEXT_PUBLIC_DONATION_SERVICE_URL;

  private readonly USERS_SERVICE_URL =
    process.env.USERS_SERVICE_URL || process.env.NEXT_PUBLIC_USERS_SERVICE_URL;

  private CDN_SERVICE_URL =
    process.env.CDN_SERVICE_URL || process.env.NEXT_PUBLIC_CDN_SERVICE_URL;

  public getDonationServiceUrl(path: string) {
    return `${this.DONATION_SERVICE_URL}/${path}`;
  }

  public getUsersFileServiceUrl(path: string) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${this.USERS_SERVICE_URL}${path}`;
  }

  public getDonationFileServiceUrl(path: string) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${this.DONATION_SERVICE_URL}${path}`;
  }

  public getUsersServiceUrl(path: string) {
    return `${this.USERS_SERVICE_URL}/${path}`;
  }

  public getCdnServiceUrl(path: string) {
    return `${this.CDN_SERVICE_URL}/${path}`;
  }
}
