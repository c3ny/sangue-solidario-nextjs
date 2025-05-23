import "./bootstrap.min.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WelcomeSection } from "@/features/Home/Welcome";
import { MapSection } from "@/features/Home/Map";
import { AboutSection } from "@/features/Home/About";
import { BlogSection } from "@/features/Home/Blog";

export default function Home() {
  return (
    <>
      <div className="container mb-5">
        <WelcomeSection />

        <MapSection />

        <AboutSection />

        <BlogSection />
      </div>
    </>
  );
}
