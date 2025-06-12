import blogApi from "@/features/Blog/services/blog.service";
import BlogHero from "@/features/Blog/components/Hero";
import ListOfPosts from "@/features/Blog/components/PostsCarousel";
import styles from "./styles.module.scss";

export default async function Blog() {
  const data = await blogApi.getPostList();

  const firstPost = data[0];

  return (
    <div className={styles.blogPage}>
      <BlogHero
        id={firstPost.id}
        title={firstPost.title}
        description={firstPost.description}
        image={firstPost.image}
      />
      <div className={styles.contentContainer}>
        <ListOfPosts posts={data.slice(1)} />
      </div>
    </div>
  );
}
