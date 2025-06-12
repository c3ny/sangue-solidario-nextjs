import { Post } from "@/features/Blog/interfaces/Post.interface";
import { ApiService } from "../../../service/api/api";

class BlogApiService extends ApiService {
  override path = "blog";

  async getPostList(): Promise<Post[]> {
    const response = await this.request();

    return response.json();
  }

  async getPost(id: number): Promise<Post> {
    const response = await this.request(id.toString());

    return response.json();
  }
}

export default new BlogApiService();
