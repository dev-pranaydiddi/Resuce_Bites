import React from 'react';

const TestimonialCard = ({ testimonial }) => {
  // Generate consistent avatar URL based on user's ID
  const avatarUrl = `https://randomuser.me/api/portraits/${
    testimonial.userId % 2 === 0 ? 'women' : 'men'
  }/${(testimonial.userId * 13) % 100}.jpg`;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md relative">
      <div className="text-[hsl(var(--primary-light))] text-5xl absolute -top-4 left-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <path d="M10 11l-2.4-4.8c-0.9-1.7-1.5-3-1.6-3.2-0.2-0.4-0.7-0.8-1.5-1.2-0.8-0.4-1.7-0.7-2.5-0.7v-1.1h11v11h-3v-11zM22 11l-2.4-4.8c-0.9-1.7-1.5-3-1.6-3.2-0.2-0.4-0.7-0.8-1.5-1.2-0.8-0.4-1.7-0.7-2.5-0.7v-1.1h11v11h-3v-11z" />
        </svg>
      </div>
      <div className="pt-8">
        <p className="text-neutral-800 italic mb-6">{testimonial.quote}</p>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden mr-4">
            <img
              src={avatarUrl}
              alt={testimonial.user?.name || 'Testimonial author'}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-heading font-semibold">
              {testimonial.user?.name || 'Anonymous'}
            </h4>
            <p className="text-sm text-neutral-600">
              {testimonial.userRole || 'Community Member'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
