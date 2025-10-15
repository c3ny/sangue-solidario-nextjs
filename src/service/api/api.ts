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

  public getUsersServiceUrl(path: string) {
    return `http://${this.USERS_SERVICE_URL}/${path}`;
  }

  public async get(url: string, options?: RequestInit) {
    const response = await fetch(url, {
      method: "GET",
      ...this.httpOptions,
      // Default: cache for 60 seconds, then revalidate in background
      next: { revalidate: 60 },
      ...options,
    });

    if (!response.ok) {
      // Return empty array for failed requests to prevent blocking
      console.error(`HTTP error! status: ${response.status} for ${url}`);
      return null;
    }

    return response.json();
  }

  public async post(url: string, data: any) {
    const response = await fetch(url, {
      method: "POST",
      ...this.httpOptions,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
