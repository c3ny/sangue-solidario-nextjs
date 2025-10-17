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

export class APIService {
  private readonly DONATION_SERVICE_URL = process.env.DONATION_SERVICE_URL;
  private readonly USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

  private readonly httpOptions = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

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
   * @param options - Optional fetch options
   * @returns Structured API response (success or error)
   */
  public async get<T = unknown>(
    url: string,
    options?: RequestInit
  ): Promise<IAPIResponse<T>> {
    try {
      const response = await fetch(url, {
        method: "GET",
        ...this.httpOptions,
        // Default: cache for 60 seconds, then revalidate in background
        next: { revalidate: 60 },
        ...options,
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
   * @returns Structured API response (success or error)
   */
  public async post<T = unknown>(
    url: string,
    data: unknown
  ): Promise<IAPIResponse<T>> {
    try {
      const response = await fetch(url, {
        method: "POST",
        ...this.httpOptions,
        body: JSON.stringify(data),
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
   * @returns Structured API response (success or error)
   */
  public async postFormData<T = unknown>(
    url: string,
    formData: FormData
  ): Promise<IAPIResponse<T>> {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
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
   * @returns Structured API response (success or error)
   */
  public async delete<T = unknown>(url: string): Promise<IAPIResponse<T>> {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        ...this.httpOptions,
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
