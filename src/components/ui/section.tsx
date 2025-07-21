// src/components/ui/section.tsx
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "gray" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl";
}

export const Section = ({
  children,
  className,
  background = "default",
  padding = "md",
}: SectionProps) => {
  const backgroundClasses = {
    default: "bg-white",
    gray: "bg-gray-50",
    gradient: "bg-gradient-to-r from-blue-600 to-blue-500",
  };

  const paddingClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-20",
  };

  return (
    <section
      className={cn(
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};