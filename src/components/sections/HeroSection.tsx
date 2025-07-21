// components/sections/HeroSection.tsx
import Link from "next/link";
import { ArrowRight, Star, BookOpen, BarChart2, Award } from "lucide-react";
import { Button, Section } from "@/components/ui";

const HeroSection = () => {
  return (
    <Section
      background="gradient"
      padding="xl"
      className="relative overflow-hidden min-h-[600px] flex items-center"
    >
      {/* Background Image - Éducation moderne */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay coloré */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/70 to-accent/50" />

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
          <BookOpen className="w-5 h-5 mr-2 text-white" />
          <span className="text-white font-medium">#1 Test Prep Platform</span>
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mx-auto">
            <span className="text-white drop-shadow-md">
            Transform Your
            </span>
            <span className="block mt-3 text-primary drop-shadow-md">Test Scores</span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
          Get <span className="font-semibold text-white">personalized</span> prep with our
          <span className="text-warning font-medium"> proven methodology</span> and
          <span className="text-white font-semibold drop-shadow-sm"> expert tutors</span>.
        </p>

        {/* Bouton principal */}
        <div className="mt-10 flex justify-center">
          <Button
            size="xl"
            className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg font-bold border-2 border-white"
            asChild
          >
            <Link href="/auth/register" className="flex items-center gap-2">
              Start Free Assessment
              <ArrowRight className="h-6 w-6" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="grid grid-cols-3 gap-4">
{[
  {
    value: "240+",
    label: "SAT Points Gain",
    icon: BarChart2,
    // colorClass: "text-primary"
    // colorClass: "text-white drop-shadow-sm"
    colorClass: "text-primary-light"


  },
  {
    value: "98%",
    label: "Success Rate",
    icon: Award,
    colorClass: "text-warning"
  },
  {
    value: "4.9/5",
    label: "Rating",
    icon: Star,
    colorClass: "text-yellow-300"
  },
].map((stat, index) => (
  <div key={index} className="flex items-center gap-3">
    <stat.icon className={`w-8 h-8 ${stat.colorClass}`} />
    <div className="text-left">
      <div className="text-2xl font-bold text-white">{stat.value}</div>
      <div className="text-sm text-white/80">{stat.label}</div>
    </div>
  </div>
))}

          </div>
        </div>
      </div>
    </Section>
  );
};

export { HeroSection };
