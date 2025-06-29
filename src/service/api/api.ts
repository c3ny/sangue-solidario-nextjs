export interface IRequestConfig {
  path: string;
}

export class ApiService {
  private readonly baseURL = "http://localhost:3333";

  path: string = "";

  async request(param?: string, options?: RequestInit) {
    const result = await fetch(
      `${this.baseURL}/${this.path}${param ? `/${param}` : ""}`,
      options
    );

    return result;
  }
}
