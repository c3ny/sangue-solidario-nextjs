import { IAPIResponse, IAPIRequestOptions } from "./api";

/**
 * Base class with shared HTTP methods used by both APIService (server-side)
 * and APIClient (client-side). Subclasses provide URL helpers and auth context.
 */
export abstract class BaseAPIClient {
  protected authToken: string | null = null;

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  public clearAuthToken(): void {
    this.authToken = null;
  }

  protected getAuthHeaders(token?: string): Record<string, string> {
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

  public async get<T = unknown>(
    url: string,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = { ...this.getAuthHeaders(token), ...customHeaders };
      const response = await fetch(url, { method: "GET", headers, ...restOptions });
      return this.handleResponse<T>(url, response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  public async post<T = unknown>(
    url: string,
    data: unknown,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = { ...this.getAuthHeaders(token), ...customHeaders };
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        ...restOptions,
      });
      return this.handleResponse<T>(url, response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  public async put<T = unknown>(
    url: string,
    data: unknown,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = { ...this.getAuthHeaders(token), ...customHeaders };
      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
        ...restOptions,
      });
      return this.handleResponse<T>(url, response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = { ...this.getAuthHeaders(token), ...customHeaders };
      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...restOptions,
      });
      return this.handleResponse<T>(url, response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  public async delete<T = unknown>(
    url: string,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers = { ...this.getAuthHeaders(token), ...customHeaders };
      const response = await fetch(url, { method: "DELETE", headers, ...restOptions });
      if (!response.ok) {
        return this.handleErrorResponse(url, response);
      }
      let responseData: T | undefined;
      try { responseData = await response.json(); } catch {}
      return { status: response.status, message: "Request successful", data: responseData as T };
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  public async postFormData<T = unknown>(
    url: string,
    formData: FormData,
    options?: IAPIRequestOptions
  ): Promise<IAPIResponse<T>> {
    try {
      const { token, headers: customHeaders, ...restOptions } = options || {};
      const headers: Record<string, string> = {};
      const authToken = token || this.authToken;
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
      if (customHeaders) {
        Object.entries(customHeaders).forEach(([key, value]) => {
          if (key.toLowerCase() !== "content-type") headers[key] = value;
        });
      }
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
        ...restOptions,
      });
      return this.handleResponse<T>(url, response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  private async handleResponse<T>(url: string, response: Response): Promise<IAPIResponse<T>> {
    if (!response.ok) {
      return this.handleErrorResponse(url, response);
    }
    const data = await response.json();
    return { status: response.status, message: "Request successful", data };
  }

  private async handleErrorResponse<T>(url: string, response: Response): Promise<IAPIResponse<T>> {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}
    if (process.env.NODE_ENV === "development") console.error(`API Error: ${response.status} for ${url}`);
    return { status: response.status, message: errorMessage, error: response.statusText };
  }

  private handleNetworkError<T>(error: unknown): IAPIResponse<T> {
    return {
      status: 0,
      message: error instanceof Error ? error.message : "Network error",
      error: "NETWORK_ERROR",
    };
  }
}
