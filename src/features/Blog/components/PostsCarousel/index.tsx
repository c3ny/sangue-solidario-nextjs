import Carousel from "@/components/Carousel";
import { Post } from "@/features/Blog/interfaces/Post.interface";
import styles from "./styles.module.scss";
import PostCard from "@/features/Blog/components/PostsCarousel/Post";

export interface IListOfPostsProps {
  posts: Post[];
}

export default function ListOfPosts({ posts }: IListOfPostsProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <h2>Conheça nosso conteúdo</h2>
        <a href="/blog">Ver tudo</a>
      </div>
      <Carousel
        items={posts.map((post, i) => (
          <PostCard key={post.title + i} {...post} />
        ))}
      />
    </div>
  );
}
