import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-neutral-900 text-white">
      <div className="absolute inset-0 z-0 opacity-40">
        <div 
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center"
          aria-hidden="true"
        />
      </div>
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-bold text-3xl md:text-5xl mb-4">Share Food, Share Hope</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Connect excess food with those who need it most. Join our mission to reduce food waste and fight hunger in our communities.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-6 rounded-md transition-colors">
              <Link href="/donate">Donate Food</Link>
            </Button>
            <Button asChild variant="outline" className="bg-white hover:bg-neutral-100 text-primary border-white font-medium px-6 py-6 rounded-md transition-colors">
              <Link href="/request">Request Donation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
