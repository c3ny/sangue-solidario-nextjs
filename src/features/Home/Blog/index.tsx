import styles from "./styles.module.scss";
import ListOfPosts from "@/features/Blog/ListOfPosts";
import { Post } from "@/interfaces/Post.interface";

export interface IBlogSectionProps {
  posts: Post[];
}
export async function BlogSection({ posts }: IBlogSectionProps) {
  return (
    <div className={styles.postsContainer}>
      <ListOfPosts posts={posts} />
    </div>
  );
}
