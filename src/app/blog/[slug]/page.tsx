import blogApi from "@/service/api/blog.api";
import styles from "./styles.module.scss";
import ListOfPosts from "@/features/Blog/ListOfPosts";
import PostContentHandler from "@/components/PostContentHandler";

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    await blogApi.getPost(Number(slug)),
    await blogApi.getPostList(),
  ]);

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
        <PostContentHandler content={post.description} />
      </div>
      <div className={styles.postCarousel}>
        <ListOfPosts posts={posts.filter((post) => post.id !== Number(slug))} />
      </div>
    </>
  );
}
