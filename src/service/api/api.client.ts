import {
  IAPIResponse,
  IAPIRequestOptions,
  isAPISuccess,
  isAPIError,
} from "./api";
import { getClientUrl } from "@/config/microservices";

/**
 * Client-side API service for making HTTP requests from browser components
 * Uses NEXT_PUBLIC_ environment variables for client-side access
 */
export class APIClient {
  // Store token for client-side usage
  private authToken: string | null = null;

  /**
   * Set the JWT token for authenticated requests
   * @param token - JWT token to use for authentication
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear the stored JWT token
   */
  public clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * Get authorization headers with JWT token
   * @param token - Optional token to override the stored token
   * @returns Headers object with Authorization header if token is available
   */
  private getAuthHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const authToken = token || this.authToken;
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    return headers;
  }

  /**
   * Get donation service URL for client-side requests
   * @param path - API endpoint path
   * @returns Full URL for donation service
   */
  public getDonationServiceUrl(path: string): string {
    return getClientUrl("donation", path);
  }

  /**
   * Get users service URL for client-side requests
   * @param path - API endpoint path
   * @returns Full URL for users service
   */
  public getUsersServiceUrl(path: string): string {
    return getClientUrl("users", path);
  }

  /**
   * Get blood stock service URL for client-side requests
   * @param path - API endpoint path
   * @returns Full URL for blood stock service
   */
  public getBloodStockServiceUrl(path: string): string {
    return getClientUrl("bloodStock", path);
  }

  /**
   * Make a GET request
   * @param url - Request URL
   * @param options - Request options
   * @returns API response
   */
  public async get<T = unknown>(
    url: string,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = {
        ...this.getAuthHeaders(token),
        ...customHeaders,
      };

      const response = await fetch(url, {
        method: "GET",
        headers,
        ...restOptions,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}

        console.error(`API Error: ${response.status} for ${url}`);

        return {
          status: response.status,
          message: errorMessage,
          error: response.statusText,
        };
      }

      const data = await response.json();

      return {
        status: response.status,
        message: "Request successful",
        data,
      };
    } catch (error) {
      console.error(`Network error for ${url}:`, error);

      return {
        status: 0,
        message: error instanceof Error ? error.message : "Network error",
        error: "NETWORK_ERROR",
      };
    }
  }

  /**
   * Make a POST request
   * @param url - Request URL
   * @param data - Request data
   * @param options - Request options
   * @returns API response
   */
  public async post<T = unknown>(
    url: string,
    data: unknown,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = {
        ...this.getAuthHeaders(token),
        ...customHeaders,
      };

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        ...restOptions,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}

        console.error(`API Error: ${response.status} for ${url}`);

        return {
          status: response.status,
          message: errorMessage,
          error: response.statusText,
        };
      }

      const responseData = await response.json();

      return {
        status: response.status,
        message: "Request successful",
        data: responseData,
      };
    } catch (error) {
      console.error(`Network error for ${url}:`, error);

      return {
        status: 0,
        message: error instanceof Error ? error.message : "Network error",
        error: "NETWORK_ERROR",
      };
    }
  }

  /**
   * Make a PUT request
   * @param url - Request URL
   * @param data - Request data
   * @param options - Request options
   * @returns API response
   */
  public async put<T = unknown>(
    url: string,
    data: unknown,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = {
        ...this.getAuthHeaders(token),
        ...customHeaders,
      };

      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        ...restOptions,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}

        console.error(`API Error: ${response.status} for ${url}`);

        return {
          status: response.status,
          message: errorMessage,
          error: response.statusText,
        };
      }

      const responseData = await response.json();

      return {
        status: response.status,
        message: "Request successful",
        data: responseData,
      };
    } catch (error) {
      console.error(`Network error for ${url}:`, error);

      return {
        status: 0,
        message: error instanceof Error ? error.message : "Network error",
        error: "NETWORK_ERROR",
      };
    }
  }

  /**
   * Make a PATCH request
   * @param url - Request URL
   * @param data - Request data
   * @param options - Request options
   * @returns API response
   */
  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = {
        ...this.getAuthHeaders(token),
        ...customHeaders,
      };

      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...restOptions,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}

        console.error(`API Error: ${response.status} for ${url}`);

        return {
          status: response.status,
          message: errorMessage,
          error: response.statusText,
        };
      }

      const responseData = await response.json();

      return {
        status: response.status,
        message: "Request successful",
        data: responseData,
      };
    } catch (error) {
      console.error(`Network error for ${url}:`, error);

      return {
        status: 0,
        message: error instanceof Error ? error.message : "Network error",
        error: "NETWORK_ERROR",
      };
    }
  }

  /**
   * Make a DELETE request
   * @param url - Request URL
   * @param options - Request options
   * @returns API response
   */
  public async delete<T = unknown>(
    url: string,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = {
        ...this.getAuthHeaders(token),
        ...customHeaders,
      };

      const response = await fetch(url, {
        method: "DELETE",
        headers,
        ...restOptions,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}

        console.error(`API Error: ${response.status} for ${url}`);

        return {
          status: response.status,
          message: errorMessage,
          error: response.statusText,
        };
      }

      let responseData: T | undefined;
      try {
        responseData = await response.json();
      } catch {}

      return {
        status: response.status,
        message: "Request successful",
        data: responseData as T,
      };
    } catch (error) {
      console.error(`Network error for ${url}:`, error);

      return {
        status: 0,
        message: error instanceof Error ? error.message : "Network error",
        error: "NETWORK_ERROR",
      };
    }
  }

  /**
   * Make a POST request with FormData (for file uploads)
   * @param url - Request URL
   * @param formData - FormData object
   * @param options - Request options
   * @returns API response
   */
  public async postFormData<T = unknown>(
    url: string,
    formData: FormData,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};

      const headers: Record<string, string> = {};

      const authToken = token || this.authToken;
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      if (customHeaders) {
        Object.entries(customHeaders).forEach(([key, value]) => {
          if (key.toLowerCase() !== "content-type") {
            headers[key] = value;
          }
        });
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
        ...restOptions,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}

        console.error(`API Error: ${response.status} for ${url}`);

        return {
          status: response.status,
          message: errorMessage,
          error: response.statusText,
        };
      }

      const responseData = await response.json();

      return {
        status: response.status,
        message: "Request successful",
        data: responseData,
      };
    } catch (error) {
      console.error(`Network error for ${url}:`, error);

      return {
        status: 0,
        message: error instanceof Error ? error.message : "Network error",
        error: "NETWORK_ERROR",
      };
    }
  }

  /**
   * Check if the client has an authentication token
   * @returns True if token is available
   */
  public isAuthenticated(): boolean {
    return this.authToken !== null;
  }

  /**
   * Get the current authentication token
   * @returns Current token or null
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }
}

// Export type guards for convenience
export { isAPISuccess, isAPIError };

// Create and export a singleton instance for easy use
export const apiClient = new APIClient();
