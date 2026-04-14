import "../bootstrap.min.css";
import { WelcomeSection } from "@/features/Home/components/Welcome";
import { MapWrapper } from "@/features/Home/components/MapWrapper";
import { FeatureFlag } from "@/components/FeatureFlag";
import { AboutSection } from "@/features/Home/components/About";
import { BlogSection } from "@/features/Home/components/Blog";
import { StepByStepSection } from "@/features/Home/components/StepByStep";
import { BloodDonationSection } from "@/features/Home/components/BloodDonation";
import { FAQSection } from "@/features/Home/components/FAQ";
import LibrasWrapper from "@/components/Libras/LibrasWrapper";

export default function Home() {
  return (
    <div className="container mb-5">
      <WelcomeSection />
      <MapWrapper />

      <StepByStepSection />

      <BloodDonationSection />

      <FeatureFlag feature="aboutUs">
        <AboutSection />
      </FeatureFlag>

      <FAQSection />

      <FeatureFlag feature="blog">
        <BlogSection posts={[]} />
      </FeatureFlag>
      <LibrasWrapper />
    </div>
  );
}
