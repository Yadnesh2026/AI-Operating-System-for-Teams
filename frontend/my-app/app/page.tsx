import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureGrid from "./components/FeatureGrid";
import TopManagementSection from "./components/TopManagementSection";
import AIAssistantDemo from "./components/AIAssistantDemo";
import CTASection, { Footer } from "./components/CTASection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ overflow: "hidden" }}>
        <HeroSection />
        <FeatureGrid />
        <TopManagementSection />
        <AIAssistantDemo />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
