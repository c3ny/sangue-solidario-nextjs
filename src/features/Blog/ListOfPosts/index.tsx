import Carousel from "@/components/Carousel";
import { Post } from "@/interfaces/Post.interface";
import { Box, Card } from "@mui/material";
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
      <Carousel
        items={posts.map((post, i) => (
          <a
            className={styles.postLink}
            key={post.title + i}
            href={`/blog/${post.id}`}
          >
            <Card
              sx={{
                width: 300,
                height: "auto",
                maxWidth: 350,
                flex: "1 1 auto",
                boxShadow: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                cursor: post.id ? "pointer" : "default",
                transition: "transform 0.3s, box-shadow 0.3s",
                zIndex: 0,
                "&:hover": {
                  transform: "translateY(-20px)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                  zIndex: 10,
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  overflow: "hidden",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </Box>
              <Box sx={{ p: 2 }}>
                <Box
                  component="h3"
                  sx={{ fontSize: "1rem", fontWeight: "bold", mb: 1 }}
                >
                  {post.title}
                </Box>
                <Box
                  component="p"
                  sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                >
                  {post.description}
                </Box>
              </Box>
            </Card>
          </a>
        ))}
      />
    </div>
  );
}
