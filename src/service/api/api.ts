/**
 * API Error Response structure
 */
export interface IAPIErrorResponse {
  status: number;
  message: string;
  error?: string;
}

/**
 * API Success Response structure
 */
export interface IAPISuccessResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

/**
 * API Response - can be either success or error
 */
export type IAPIResponse<T = unknown> =
  | IAPISuccessResponse<T>
  | IAPIErrorResponse;

/**
 * Type guard to check if response is an error
 */
export function isAPIError(
  response: IAPIResponse
): response is IAPIErrorResponse {
  return "error" in response || response.status >= 400;
}

/**
 * Type guard to check if response is successful
 */
export function isAPISuccess<T>(
  response: IAPIResponse<T>
): response is IAPISuccessResponse<T> {
  return !isAPIError(response);
}

/**
 * Options for API requests with optional authentication
 */
export interface IAPIRequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  token?: string; // Optional JWT token for authentication
}

export class APIService {
 private readonly DONATION_SERVICE_URL = process.env.NEXT_PUBLIC_DONATION_SERVICE_URL;
 private readonly USERS_SERVICE_URL = process.env.NEXT_PUBLIC_USERS_SERVICE_URL;


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

  public getDonationServiceUrl(path: string) {
    return `http://${this.DONATION_SERVICE_URL}/${path}`;
  }

  public getUsersFileServiceUrl(path: string) {
    return `http://localhost:3002${path}`;
  }

  public getUsersServiceUrl(path: string) {
    return `http://${this.USERS_SERVICE_URL}/${path}`;
  }

  /**
   * GET request with structured response
   * @param url - The URL to fetch from
   * @param options - Optional fetch options with token support
   * @returns Structured API response (success or error)
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
        // Default: cache for 60 seconds, then revalidate in background
        next: { revalidate: 60 },
        ...restOptions,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;

        // Try to get error message from response body
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use default error message
        }

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
   * POST request with structured response
   * @param url - The URL to post to
   * @param data - The data to send in the request body
   * @param options - Optional fetch options with token support
   * @returns Structured API response (success or error)
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

        // Try to get error message from response body
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use default error message
        }

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
   * PUT request with structured response
   * @param url - The URL to send PUT request to
   * @param data - The data to send in the request body
   * @param options - Optional fetch options with token support
   * @returns Structured API response (success or error)
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

        // Try to get error message from response body
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use default error message
        }

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
   * PATCH request with structured response
   * @param url - The URL to send PATCH request to
   * @param data - The data to send in the request body (optional for some PATCH requests)
   * @param options - Optional fetch options with token support
   * @returns Structured API response (success or error)
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

        // Try to get error message from response body
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use default error message
        }

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
   * POST request with FormData (for file uploads)
   * @param url - The URL to post to
   * @param formData - The FormData to send
   * @param options - Optional fetch options with token support
   * @returns Structured API response (success or error)
   */
  public async postFormData<T = unknown>(
    url: string,
    formData: FormData,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};

      // For FormData, we need to handle headers differently
      // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      const headers: Record<string, string> = {};

      const authToken = token || this.authToken;
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      // Add any custom headers (except Content-Type which should be auto-set)
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

        // Try to get error message from response body
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use default error message
        }

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
   * DELETE request with structured response
   * @param url - The URL to send DELETE request to
   * @param options - Optional fetch options with token support
   * @returns Structured API response (success or error)
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

        // Try to get error message from response body
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use default error message
        }

        console.error(`API Error: ${response.status} for ${url}`);

        return {
          status: response.status,
          message: errorMessage,
          error: response.statusText,
        };
      }

      // DELETE might return empty response
      let responseData: T | undefined;
      try {
        responseData = await response.json();
      } catch {
        // No response body is fine for DELETE
      }

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
}
