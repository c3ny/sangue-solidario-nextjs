import blogApi from "@/service/api/blog.api";
import styles from "./styles.module.scss";
import ListOfPosts from "@/features/Blog/ListOfPosts";

export async function BlogSection() {
  const data = await blogApi.getPostList();

  return (
    <div className={styles.postsContainer}>
      <ListOfPosts posts={data} />
    </div>
  );
}
