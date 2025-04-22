import React, { useState, useEffect } from 'react';
import { getAllTestimonials } from '@/lib/donation-api';
import TestimonialCard from './TestimonialCard';
import { Skeleton } from '@/components/ui/skeleton';

const TestimonialsList = ({ limit }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getAllTestimonials()
      .then((data) => {
        if (isMounted) {
          setTestimonials(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch testimonials:', err);
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: limit || 3 }).map((_, idx) => (
          <div key={idx} className="bg-white p-8 rounded-lg shadow-md relative">
            <Skeleton className="h-6 w-10 absolute -top-2 left-6" />
            <div className="pt-8">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="flex items-center">
                <Skeleton className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Failed to load testimonials.</p>;
  }

  const displayed = limit ? testimonials.slice(0, limit) : testimonials;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayed.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
};

export default TestimonialsList;
