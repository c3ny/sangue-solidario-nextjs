import "./bootstrap.min.css";
import { WelcomeSection } from "@/features/Home/components/Welcome";
import { MapSection } from "@/features/Home/components/Map";
import { AboutSection } from "@/features/Home/components/About";
import { BlogSection } from "@/features/Home/components/Blog";
import donationsService from "../features/Solicitations/services/donations.service";
import blogApi from "@/features/Blog/services/blog.service";

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
