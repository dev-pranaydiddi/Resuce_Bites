import { UserPlus, List, Handshake } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
            How It Works
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our platform makes it easy to connect those with surplus food to those who need it most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[hsl(var(--primary-light))] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-[hsl(var(--primary-dark))]" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">1. Create an Account</h3>
            <p className="text-neutral-600">
              Sign up as a donor or an organization looking for donations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[hsl(var(--secondary-light))] rounded-full flex items-center justify-center mx-auto mb-4">
              <List className="h-8 w-8 text-[hsl(var(--secondary-dark))]" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">2. Post or Browse</h3>
            <p className="text-neutral-600">
              List your available food or browse donations in your area.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[hsl(var(--accent-light))] rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="h-8 w-8 text-[hsl(var(--accent-dark))]" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">3. Connect & Share</h3>
            <p className="text-neutral-600">
              Coordinate pickup or delivery and track your impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
