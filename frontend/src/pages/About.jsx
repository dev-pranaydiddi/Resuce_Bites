import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Utensils, BarChart2, Globe } from "lucide-react";
// import TestimonialsList from "../components/PageComponents/TestimonialsList";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | FoodShare</title>
        <meta
          name="description"
          content="Learn about FoodShare's mission to reduce food waste and fight hunger in our communities."
        />
      </Helmet>

      <div className="bg-gradient-to-r from-[hsl(var(--primary-light))] to-[hsl(var(--primary))] py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            About FoodShare
          </h1>
          <p className="text-white text-lg max-w-2xl">
            Our mission, vision, and the story behind our food donation platform.
          </p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Mission */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                At FoodShare, we believe that no good food should go to waste while people go hungry. Our mission is to create a sustainable ecosystem where surplus food from businesses and individuals can efficiently reach those who need it most.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We aim to reduce food waste, fight hunger, and build stronger communities by connecting food donors directly with organizations that serve vulnerable populations.
              </p>
            </div>

            {/* Vision */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-800 mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-neutral-700 mb-6 leading-relaxed">
                We envision a world where no edible food goes to waste, where communities come together to ensure everyone has access to nutritious meals, and where our shared resources are used sustainably.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Through technology and community engagement, we're working to make food redistribution simple, efficient, and accessible to all.
              </p>
            </div>

            {/* Problem */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-800 mb-6">
                The Problem We're Solving
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                  <div className="w-12 h-12 bg-[hsl(var(--primary-light))] rounded-full flex items-center justify-center mb-4">
                    <Utensils className="h-6 w-6 text-[hsl(var(--primary-dark))]" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Food Waste</h3>
                  <p className="text-neutral-700">
                    Approximately one-third of all food produced globally is wasted. In our community alone, tons of edible food end up in landfills every day, contributing to greenhouse gas emissions.
                  </p>
                </div>
                <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                  <div className="w-12 h-12 bg-[hsl(var(--secondary-light))] rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-[hsl(var(--secondary-dark))]" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">Food Insecurity</h3>
                  <p className="text-neutral-700">
                    Millions of people face food insecurity and don't know where their next meal will come from. Organizations working to address hunger often struggle to secure consistent food donations.
                  </p>
                </div>
              </div>
              <p className="text-lg text-neutral-700 leading-relaxed">
                FoodShare bridges this gap by connecting those with surplus food directly to those who can distribute it to people in need, creating a more efficient and sustainable food ecosystem.
              </p>
            </div>

            {/* Impact */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-800 mb-6">
                Our Impact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-[hsl(var(--primary))] mb-2">145,782</div>
                  <p className="text-neutral-700 font-heading uppercase tracking-wider text-sm">Meals Shared</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-[hsl(var(--secondary))] mb-2">3,241</div>
                  <p className="text-neutral-700 font-heading uppercase tracking-wider text-sm">Active Donors</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-[hsl(var(--accent))] mb-2">287</div>
                  <p className="text-neutral-700 font-heading uppercase tracking-wider text-sm">Partner Organizations</p>
                </div>
              </div>
              <p className="text-lg text-neutral-700 leading-relaxed">
                Since our founding, we've helped redistribute thousands of pounds of food that would otherwise go to waste. Every donation makes a difference in someone's life and helps create a more sustainable community.
              </p>
            </div>

            {/* Values */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-800 mb-6">
                Our Values
              </h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-12 h-12 bg-[hsl(var(--accent-light))] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[hsl(var(--accent-dark))]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Action</h3>
                    <p className="text-neutral-700">
                      We believe in taking concrete action to address food waste and hunger, creating practical solutions that work in the real world.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-12 h-12 bg-[hsl(var(--primary-light))] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Globe className="h-6 w-6 text-[hsl(var(--primary-dark))]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Sustainability</h3>
                    <p className="text-neutral-700">
                      We're committed to environmental sustainability, reducing the carbon footprint associated with food waste through efficient redistribution.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-12 h-12 bg-[hsl(var(--secondary-light))] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[hsl(var(--secondary-dark))]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Community</h3>
                    <p className="text-neutral-700">
                      We believe in the power of community to solve problems. By connecting donors with organizations, we're building stronger, more resilient communities.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-12 h-12 bg-[hsl(var(--accent-light))] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <BarChart2 className="h-6 w-6 text-[hsl(var(--accent-dark))]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Transparency</h3>
                    <p className="text-neutral-700">
                      We believe in transparency in all we do, providing clear information about our operations, impact, and the journey of donated food.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            {/* <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-800 mb-8 text-center">
                What People Say About Us
              </h2>
              <TestimonialsList limit={3} />
            </div> */}

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-xl font-heading font-semibold mb-6">Join Our Mission</h3>
              <p className="text-lg text-neutral-700 mb-8 max-w-2xl mx-auto">
                Whether you're a business with surplus food, an organization serving those in need, or an individual looking to make a difference, you can be part of our mission to reduce waste and fight hunger.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="px-8">
                    Join FoodShare
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="px-8">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
