import BlogHero from "@/features/Blog/components/Hero";
import ListOfPosts from "@/features/Blog/components/PostsCarousel";
import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

export default async function Blog() {
  const posts = [
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
  ];
  const firstPost = posts[0];

  return (
    <div className={styles.blogPage}>
      <BlogHero
        id={firstPost.id}
        title={firstPost.title}
        description={firstPost.description}
        image={firstPost.image}
      />
      <div className={styles.contentContainer}>
        <ListOfPosts posts={posts.slice(1)} />
      </div>
    </div>
  );
}
