// components/sections/HowItWorksSection.tsx
import { Calendar, CheckCircle, CreditCard, Sparkles } from "lucide-react";
import { Section } from "@/components/ui";

const steps = [
  {
    id: 1,
    name: "Initial Assessment",
    description:
      "We evaluate your child's strengths and areas for improvement.",
    icon: Calendar,
  },
  {
    id: 2,
    name: "Personalized Plan",
    description:
      "Create a customized study plan based on assessment results.",
    icon: CheckCircle,
  },
  {
    id: 3,
    name: "Targeted Learning",
    description:
      "Engage with interactive lessons and practice materials.",
    icon: Sparkles,
  },
  {
    id: 4,
    name: "Progress Tracking",
    description:
      "Monitor improvement with regular practice tests and analytics.",
    icon: CreditCard,
  },
];

const HowItWorksSection = () => {
  return (
    <Section background="gray" padding="xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
          How Our Program Works
        </h2>
        <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          A proven process to help students achieve their academic goals
        </p>
      </div>

      <div className="relative">
        {/* Ligne de connexion pour desktop */}
        <div className="hidden lg:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-primary-200"></div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.id} className="text-center relative">
                {/* Numéro de l'étape */}
                <div className="relative mx-auto mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-white text-sm font-bold">
                    {step.id}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {step.name}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Flèche pour mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8">
                    <div className="w-px h-8 bg-primary-200"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export { HowItWorksSection };