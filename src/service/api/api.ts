export class APIService {
  private readonly DONATION_SERVICE_URL = process.env.DONATION_SERVICE_URL;
  private readonly USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

  public getDonationServiceUrl(path: string) {
    return `http://${this.DONATION_SERVICE_URL}/${path}`;
  }

  public getUsersServiceUrl(path: string) {
    return `http://${this.USERS_SERVICE_URL}/${path}`;
  }

  public async get(url: string) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  public async post(url: string, data: any) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
