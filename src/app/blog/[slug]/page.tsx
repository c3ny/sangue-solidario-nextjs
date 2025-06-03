import blogApi from "@/service/api/blog.api";
import Image from "next/image";
import styles from "./styles.module.scss";
import ListOfPosts from "@/features/Blog/ListOfPosts";

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await blogApi.getPost(Number((await params).slug));

  const posts = await blogApi.getPostList();

  return (
    <>
      <div className={styles.postHeader}>
        <img
          className={styles.postHeroImage}
          src={post.image}
          alt="Destaque Blog"
          width={1200}
          height={400}
        />
      </div>

      <div className={styles.postContent}>
        <h2 className="mb-3 fw-bold">{post.title}</h2>
        <p>{post.description}</p>
      </div>
      <div className={styles.postCarousel}>
        <ListOfPosts posts={posts} />
      </div>
    </>
  );
}
