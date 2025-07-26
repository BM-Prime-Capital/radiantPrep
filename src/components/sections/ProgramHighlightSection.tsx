"use client";

import Link from "next/link";
import {
  BookOpen,
  BarChart2,
  Award,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button, Section } from "@/components/ui";

const highlights = [
  {
    icon: BookOpen,
    title: "ELA Diagnostic",
    desc: "Comprehensive English Language Arts assessment",
    iconClass: "text-primary",
    bgClass: "bg-secondary",
  },
  {
    icon: BarChart2,
    title: "Math Diagnostic",
    desc: "Complete mathematics proficiency evaluation",
    iconClass: "text-warning",
    bgClass: "bg-warning/10",
  },
  {
    icon: Award,
    title: "Insightful Score Reports",
    desc: "Track improvement over time",
    iconClass: "text-accent",
    bgClass: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Learning Roadmap",
    desc: "Tools to support your child's learning",
    iconClass: "text-primary-light",
    bgClass: "bg-secondary",
  },
];

const outcome = {
  title: "100% Free for Radiant Prep Clients",
  description: "Register your child and receive their unique access code via email",
  cta: "Create Free Account",
};

export const ProgramHighlightSection = () => {
  return (
    <Section padding="xl" className="bg-background-page">
      {/* Titre */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-secondary text-primary font-medium rounded-full text-sm mb-2">
          Effective evaluation platform
        </span>
        <h2 className="text-3xl font-bold text-foreground">
          A <span className="text-primary">Smarter</span> Way to Learn
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Personalized diagnostics and progress tracking for optimal learning
        </p>
      </div>

      {/* Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
        {highlights.map((item, i) => (
          <div
            key={i}
            className={`rounded-xl p-6 shadow-soft text-center ${item.bgClass}`}
          >
            <div className="flex justify-center mb-4">
              <item.icon className={`w-8 h-8 ${item.iconClass}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Bloc final */}
      <div className="bg-gradient-to-r from-secondary to-muted rounded-3xl p-10 md:p-14 text-center shadow-sm">
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {outcome.title}
          </h3>
          <p className="text-muted-foreground mb-6">{outcome.description}</p>
          <Button
            size="lg"
            className="bg-[#cc00d5] text-primary-foreground hover:bg-primary/90 shadow-lg"
            asChild
          >
            <Link href="/auth/register">
              {outcome.cta} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
};
