import { Post } from "@/features/Blog/interfaces/Post.interface";
import styles from "./styles.module.scss";
import Link from "next/link";

export interface IListOfPostsProps {
  posts: Post[];
}

export default function ListOfPosts({}: IListOfPostsProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <h2>Conheça nosso conteúdo</h2>
        <Link href="/blog">Ver tudo</Link>
      </div>
    </div>
  );
}
