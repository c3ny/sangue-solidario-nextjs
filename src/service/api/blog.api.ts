import { Post } from "@/interfaces/Post.interface";
import { ApiService } from "./api";

class BlogApiService extends ApiService {
  override path = "blog";

  async getPostList(): Promise<Post[]> {
    const response = await this.request();

    return response.json();
  }
}

export default new BlogApiService();
