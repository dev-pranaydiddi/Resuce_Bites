import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--secondary-dark))] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Join our community of donors and organizations working together to fight hunger and reduce waste.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button 
              size="lg" 
              className="bg-white hover:bg-neutral-100 text-[hsl(var(--secondary-dark))] rounded-full shadow-lg text-lg px-8 py-6 h-auto font-heading font-semibold"
            >
              Sign Up Now
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 rounded-full shadow-lg text-lg px-8 py-6 h-auto font-heading font-semibold"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
