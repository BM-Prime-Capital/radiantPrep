import { PublicLayout } from "@/components/layout";
import {
  HeroSection,
  ProgramHighlightSection,
  // HowItWorksSection,
  // TestimonialsSection,
} from "@/components/sections";

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <ProgramHighlightSection />
      {/* <HowItWorksSection /> */}
      {/* <TestimonialsSection /> */}
    </PublicLayout>
  );
}