import { UserPlus, Carrot, Handshake } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Register",
      description: "Sign up as a donor or a receiving organization in just a few minutes."
    },
    {
      icon: <Carrot className="h-8 w-8" />,
      title: "List or Request",
      description: "List your available food donations or request what your organization needs."
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: "Connect",
      description: "We facilitate the connection and help coordinate the donation process."
    }
  ];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-3">How It Works</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our platform makes food donation simple, secure, and efficient.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
