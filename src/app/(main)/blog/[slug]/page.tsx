import blogApi from "@/features/Blog/services/blog.service";
import styles from "./styles.module.scss";
import ListOfPosts from "@/features/Blog/components/PostsCarousel";
import PostContentHandler from "@/features/Blog/components/PostsCarousel/Post/PostContentHandler";

export const dynamic = "force-dynamic";

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    Promise.resolve({
      image: "https://via.placeholder.com/150",
      title: "Post 1",
      description: "Description 1",
    }),
    Promise.resolve([
      {
        id: 1,
        title: "Post 1",
        description: "Description 1",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        title: "Post 2",
        description: "Description 2",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 3,
        title: "Post 3",
        description: "Description 3",
        image: "https://via.placeholder.com/150",
      },
    ]),
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
