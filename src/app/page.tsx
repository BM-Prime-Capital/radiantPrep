import { PublicLayout } from "@/components/layout";
import {
  HeroSection,
  ProgramHighlightSection,
} from "@/components/sections";

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <ProgramHighlightSection />
    </PublicLayout>
  );
}