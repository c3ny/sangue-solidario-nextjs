import { Post } from "@/features/Blog/interfaces/Post.interface";
import styles from "./styles.module.scss";

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
    </div>
  );
}
