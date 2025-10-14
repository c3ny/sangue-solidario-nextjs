import "./bootstrap.min.css";
import { WelcomeSection } from "@/features/Home/components/Welcome";
import { MapSection } from "@/features/Home/components/Map";
import { AboutSection } from "@/features/Home/components/About";
import { BlogSection } from "@/features/Home/components/Blog";
import donationsService from "@/features/Solicitations/services/donations.service";

export default async function Home() {
  const donations = await donationsService.getDonations();

  return (
    <div className="container mb-5">
      <WelcomeSection />

      <MapSection solicitations={donations} />

      <AboutSection />

      <BlogSection posts={[]} />
    </div>
  );
}
