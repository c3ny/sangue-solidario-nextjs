import { Card } from "@/components/Card";
import styles from "./styles.module.scss";

export interface IPostCardProps {
  title: string;
  description: string;
  image: string;
}

export const PostCard = ({ title, description, image }: IPostCardProps) => {
  return (
    <Card className={styles.postCard}>
      <img src={image} />
      <div className={styles.textContainer}>
        <h6>{title}</h6>
        <p>{description}</p>
      </div>
    </Card>
  );
};
