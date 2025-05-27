import blogApi from "@/service/api/blog.api";
import { PostCard } from "./Post";
import styles from "./styles.module.scss";

export async function BlogSection() {
  const data = await blogApi.getPostList();

  return (
    <>
      <div className="row">
        <h2 className="display-7 fw-bold mb-3">Se mantenha informado</h2>
      </div>
      <div className={styles.postsContainer}>
        {data.map((post) => (
          <PostCard
            key={`${post.title}-${Math.random()}`}
            title={post.title}
            description={post.description}
            image={post.image}
          />
        ))}
      </div>
    </>
  );
}
