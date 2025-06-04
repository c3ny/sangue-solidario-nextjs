import "./bootstrap.min.css";
import { WelcomeSection } from "@/features/Home/Welcome";
import { MapSection } from "@/features/Home/Map";
import { AboutSection } from "@/features/Home/About";
import { BlogSection } from "@/features/Home/Blog";
import donationsService from "./services/donations.service";

export default async function Home() {
  const data = (await donationsService.getDonations()).data;

  return (
    <div className="container mb-5">
      <WelcomeSection />

      <MapSection solicitations={data} />

      <AboutSection />

      <BlogSection />
    </div>
  );
}
