import styles from "./styles.module.scss";

export interface IBlogHeroProps {
  title: string;
  description: string;
  id: number;
  image: string;
  className?: string;
}

export default function BlogHero({
  id,
  title,
  image,
  description,
  className,
}: IBlogHeroProps) {
  return (
    <a href={`/blog/${id}`} className={styles.heroLink}>
      <div
        className={`${styles.heroContainer} ${className}`}
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className={styles.overlay}></div>
        <div className={styles.content}>
          <h3>{title}</h3>
          <p>{`${description.slice(0, 200)}...`}</p>
        </div>
      </div>
    </a>
  );
}
