import "./bootstrap.min.css";
import { WelcomeSection } from "@/features/Home/components/Welcome";
import { MapSection } from "@/features/Home/components/Map";
import donationsService from "@/features/Solicitations/services/donations.service";
import { FeatureFlag } from "@/components/FeatureFlag";
import { AboutSection } from "@/features/Home/components/About";
import { BlogSection } from "@/features/Home/components/Blog";
import { StepByStepSection } from "@/features/Home/components/StepByStep";
import { FAQSection } from "@/features/Home/components/FAQ";

export default async function Home() {
  const donations = await donationsService.getDonations();

  return (
    <div className="container mb-5">
      <WelcomeSection />

      <MapSection solicitations={donations} />

      <StepByStepSection />

      <FAQSection />

      <FeatureFlag feature="aboutUs">
        <AboutSection />
      </FeatureFlag>

      <FeatureFlag feature="blog">
        <BlogSection posts={[]} />
      </FeatureFlag>
    </div>
  );
}
