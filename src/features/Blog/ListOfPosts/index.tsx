import Carousel from "@/components/Carousel";
import { Post } from "@/interfaces/Post.interface";
import { Box, Card } from "@mui/material";
import styles from "./styles.module.scss";
import PostCard from "@/features/Home/Blog/Post";

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
