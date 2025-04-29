import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Heart,
  Users,
  Clock,
  MapPin,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const HowItWorks = () => {
  return (
    <>
      <Helmet>
        <title>How It Works | FoodShare</title>
        <meta
          name="description"
          content="Learn how the FoodShare donation process works for both donors and organizations."
        />
      </Helmet>

      <div className="bg-gradient-to-r from-blue-300 to-blue-500 py-10 px-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4">How FoodShare Works</h1>
          <p className="text-lg max-w-2xl">
            Our platform makes it easy to connect those with surplus food to
            those who need it most.
          </p>
        </div>
      </div>

      <section className="py-16 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            A Simple Process for Everyone
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Donor Section */}
            <div className="bg-gray-100 p-8 rounded-lg border">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-blue-800" />
                </div>
                <h3 className="text-xl font-semibold ml-4">For Donors</h3>
              </div>
              <ol className="space-y-4 text-gray-700">
                <li>
                  <strong>Create an account:</strong> Sign up to start sharing your surplus food.
                </li>
                <li>
                  <strong>List your donation:</strong> Provide details about the food, quantity, and pickup info.
                </li>
                <li>
                  <strong>Review requests:</strong> Organizations will request; you choose who gets it.
                </li>
                <li>
                  <strong>Coordinate pickup:</strong> Communicate to finalize pickup logistics.
                </li>
              </ol>
              <div className="mt-8">
                <Link to="/donate">
                  <Button className="w-full">Start Donating</Button>
                </Link>
              </div>
            </div>

            {/* Organization Section */}
            <div className="bg-gray-100 p-8 rounded-lg border">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-800" />
                </div>
                <h3 className="text-xl font-semibold ml-4">For Organizations</h3>
              </div>
              <ol className="space-y-4 text-gray-700">
                <li>
                  <strong>Register your organization:</strong> Create an account and share your mission.
                </li>
                <li>
                  <strong>Browse donations:</strong> Explore local food donations in real-time.
                </li>
                <li>
                  <strong>Request items:</strong> Submit requests for donations that suit your needs.
                </li>
                <li>
                  <strong>Pick up and distribute:</strong> Arrange pickup and deliver food to the community.
                </li>
              </ol>
              <div className="mt-8">
                <Link to="/request">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Find Donations
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 bg-gray-100 p-8 rounded-lg border">
            <h3 className="text-xl font-semibold mb-6">Key Features</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <Clock />,
                  title: "Real-Time Updates",
                  desc: "Track donation status and requests instantly.",
                },
                {
                  icon: <MapPin />,
                  title: "Location-Based",
                  desc: "Find nearby food and partners.",
                },
                {
                  icon: <MessageSquare />,
                  title: "Direct Communication",
                  desc: "Chat between donors and recipients.",
                },
                {
                  icon: <CheckCircle />,
                  title: "Verification System",
                  desc: "Trusted and verified network.",
                },
              ].map((item, i) => (
                <div className="flex" key={i}>
                  <div className="w-10 h-10 mr-4 bg-blue-100 rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-16 bg-gray-100 p-8 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Donation Guidelines</h3>
            <h4 className="font-semibold mb-2">Acceptable Food Items</h4>
            <ul className="list-disc pl-5 mb-4 text-gray-700">
              <li>Unopened packaged goods</li>
              <li>Fresh produce</li>
              <li>Bakery items</li>
              <li>Prepared meals</li>
              <li>Canned and dry goods</li>
              <li>Dairy products</li>
            </ul>

            <h4 className="font-semibold mb-2">Food Safety</h4>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Ensure food is safe and well-stored</li>
              <li>Use correct temperature for perishables</li>
              <li>Include expiration dates</li>
              <li>Declare allergens</li>
              <li>Package food securely</li>
            </ul>
          </div>

          {/* CTA */}
          {/* <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button className="px-6">Create an Account</Button>
              </Link>
              <Link to="/about">
                <Button className="px-6 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
