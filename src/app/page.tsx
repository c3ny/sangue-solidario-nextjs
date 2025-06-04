import "./bootstrap.min.css";
import { WelcomeSection } from "@/features/Home/Welcome";
import { MapSection } from "@/features/Home/Map";
import { AboutSection } from "@/features/Home/About";
import { BlogSection } from "@/features/Home/Blog";
import donationsService from "./services/donations.service";
import blogApi from "@/service/api/blog.api";

export default async function Home() {
  const [donations, posts] = await Promise.all([
    await donationsService.getDonations(),
    await blogApi.getPostList(),
  ]);

  return (
    <div className="container mb-5">
      <WelcomeSection />

      <MapSection solicitations={donations} />

      <AboutSection />

      <BlogSection posts={posts} />
    </div>
  );
}
