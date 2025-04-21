import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-[hsl(var(--primary-light))] to-[hsl(var(--primary))] py-16 md:py-24 relative overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6 leading-tight">
            Fighting Hunger,{' '}
            <span className="text-[hsl(var(--accent-light))]">Reducing Waste</span>
          </h1>
          <p className="text-white text-lg md:text-xl mb-8 leading-relaxed">
            Connect with local organizations to donate surplus food or find resources for those in need. Together, we can build a community where no one goes hungry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white hover:bg-neutral-100 text-[hsl(var(--primary-dark))] rounded-full shadow-lg text-lg px-8 py-6 h-auto font-heading font-semibold"
              >
                Donate Food
              </Button>
            </Link>
            <Link to="/request">
              <Button
                size="lg"
                className="bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary-dark))] text-white rounded-full shadow-lg text-lg px-8 py-6 h-auto font-heading font-semibold"
              >
                Request Food
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
