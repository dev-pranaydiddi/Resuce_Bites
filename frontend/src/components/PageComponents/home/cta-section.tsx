import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-bold text-white text-3xl mb-4">Ready to Make a Difference?</h2>
        <p className="text-white opacity-90 max-w-2xl mx-auto mb-8">
          Join our community of food donors and receivers. Together, we can reduce waste and feed those in need.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="bg-white text-primary hover:bg-neutral-100 font-medium px-6 py-3 rounded-md transition-colors">
            <Link href="/donate">Donate Food</Link>
          </Button>
          <Button asChild className="bg-[#D35400] text-white hover:bg-opacity-80 border-none font-medium px-6 py-3 rounded-md transition-colors">
            <Link href="/request">Request Donation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
