// components/sections/TestimonialsSection.tsx
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { Section, Card, CardContent } from "@/components/ui";


const testimonials = [
  {
    id: 1,
    name: "Emily Johnson",
    location: "New York, NY",
    rating: 5,
    comment:
      "My daughter's SAT score improved by 300 points after using Radiant Prep. The personalized approach made all the difference!",
    program: "SAT Prep",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b1e8?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: 2,
    name: "Michael Davis",
    location: "Los Angeles, CA",
    rating: 5,
    comment:
      "The 1-on-1 tutoring helped my son gain confidence in math. His grades improved significantly in just a few months.",
    program: "Math Tutoring",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: 3,
    name: "Sarah Wilson",
    location: "Chicago, IL",
    rating: 5,
    comment:
      "The college prep program was invaluable. Our daughter got into her dream school with a scholarship!",
    program: "College Prep",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: 4,
    name: "David Brown",
    location: "Houston, TX",
    rating: 5,
    comment:
      "The progress tracking features helped us see exactly where our son needed help. Highly recommend!",
    program: "ACT Prep",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: 5,
    name: "Jennifer Smith",
    location: "Miami, FL",
    rating: 5,
    comment:
      "We've tried other test prep programs, but Radiant Prep's adaptive learning is truly next level.",
    program: "AP Test Prep",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
  },
  {
    id: 6,
    name: "James Miller",
    location: "Seattle, WA",
    rating: 5,
    comment:
      "The tutors are knowledgeable and patient. My daughter actually looks forward to her sessions now.",
    program: "Subject Tutoring",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face&auto=format&q=80",
  },
];

const TestimonialsSection = () => {
  return (
    <Section padding="xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
          Success Stories
        </h2>
        <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          Hear from parents and students who have achieved academic success
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} variant="elevated" className="h-full">
            <CardContent className="flex flex-col h-full">
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary-600" />
              </div>

              {/* Comment */}
              <blockquote className="flex-1 text-neutral-700 leading-relaxed mb-6">
                &quot;{testimonial.comment}&quot;
              </blockquote>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-current text-yellow-400"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-neutral-600">
                  {testimonial.rating}/5
                </span>
              </div>

              {/* Author info */}
              <div className="flex items-center">
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                />
                <div className="ml-3">
                  <p className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {testimonial.location}
                  </p>
                  <p className="text-xs text-primary-600 font-medium">
                    {testimonial.program}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="mt-16 text-center">
        <p className="text-sm text-neutral-600 mb-8">
          Trusted by thousands of families nationwide
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
          {/* Logo badges - replace with real logos if available */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutral-200 rounded"></div>
            <span className="text-sm font-medium text-neutral-600">
              Certified Tutors
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutral-200 rounded"></div>
            <span className="text-sm font-medium text-neutral-600">
              Proven Results
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-neutral-200 rounded"></div>
            <span className="text-sm font-medium text-neutral-600">
              Satisfaction Guarantee
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
};

export { TestimonialsSection };