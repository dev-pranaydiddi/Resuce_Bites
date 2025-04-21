import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTestimonials = async () => {
  const response = await fetch('/api/testimonials');
  if (!response.ok) {
    throw new Error('Failed to fetch testimonials');
  }
  return response.json();
};

const TestimonialsSection = () => {
  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-3">What People Say</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Stories from donors and receiving organizations in our community.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-neutral-50 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <Quote className="text-primary text-3xl mr-3 shrink-0" />
                  <div className="w-full">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Skeleton className="w-12 h-12 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load testimonials. Please try again later.</p>
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-neutral-50 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <Quote className="text-primary text-3xl mr-3 shrink-0" />
                  <p className="italic text-neutral-700">{testimonial.text}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-300 mr-3" />
                  <div>
                    <div className="font-medium">User #{testimonial.userId}</div>
                    <div className="text-sm text-neutral-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-600">No testimonials available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
