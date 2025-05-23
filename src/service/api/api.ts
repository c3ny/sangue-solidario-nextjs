import axios, { AxiosInstance } from "axios";

export interface IRequestConfig {
  path: string;
}

export class ApiService {
  private readonly baseURL = "http://localhost:3333";
  private path: string = "";

  async request() {
    const result = await fetch(`${this.baseURL}/${this.path}`);

    return result;
  }
}
