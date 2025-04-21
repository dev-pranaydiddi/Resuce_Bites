import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, ListChecks, Clock, HandshakeIcon, MapPin, Users, MessageSquare, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet";

const HowItWorks = () => {
  return (
    <>
      <Helmet>
        <title>How It Works | FoodShare</title>
        <meta name="description" content="Learn how the FoodShare donation process works for both donors and organizations." />
      </Helmet>

      <div className="bg-gradient-to-r from-[hsl(var(--primary-light))] to-[hsl(var(--primary))] py-10 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            How FoodShare Works
          </h1>
          <p className="text-white text-lg max-w-2xl">
            Our platform makes it easy to connect those with surplus food to those who need it most.
          </p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-800 mb-8 text-center">
              A Simple Process for Everyone
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div className="bg-neutral-50 p-8 rounded-lg border border-neutral-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[hsl(var(--primary-light))] rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-[hsl(var(--primary-dark))]" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold ml-4">
                    For Donors
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="mr-3 mt-1 text-[hsl(var(--primary))]">1.</div>
                    <div>
                      <span className="font-semibold">Create an account</span>
                      <p className="text-neutral-600 mt-1">
                        Sign up as a donor to start sharing your surplus food
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1 text-[hsl(var(--primary))]">2.</div>
                    <div>
                      <span className="font-semibold">List your donation</span>
                      <p className="text-neutral-600 mt-1">
                        Provide details about the food you're donating, including quantity and pickup information
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1 text-[hsl(var(--primary))]">3.</div>
                    <div>
                      <span className="font-semibold">Review requests</span>
                      <p className="text-neutral-600 mt-1">
                        Organizations will submit requests for your donation. Review and accept the best match
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1 text-[hsl(var(--primary))]">4.</div>
                    <div>
                      <span className="font-semibold">Coordinate pickup</span>
                      <p className="text-neutral-600 mt-1">
                        Communicate with the organization to arrange the pickup details
                      </p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Link href="/donate">
                    <Button className="w-full">Start Donating</Button>
                  </Link>
                </div>
              </div>

              <div className="bg-neutral-50 p-8 rounded-lg border border-neutral-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[hsl(var(--secondary-light))] rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-[hsl(var(--secondary-dark))]" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold ml-4">
                    For Organizations
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="mr-3 mt-1 text-[hsl(var(--secondary))]">1.</div>
                    <div>
                      <span className="font-semibold">Register your organization</span>
                      <p className="text-neutral-600 mt-1">
                        Create an account and provide details about your organization
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1 text-[hsl(var(--secondary))]">2.</div>
                    <div>
                      <span className="font-semibold">Browse available donations</span>
                      <p className="text-neutral-600 mt-1">
                        Search through available food donations in your area
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1 text-[hsl(var(--secondary))]">3.</div>
                    <div>
                      <span className="font-semibold">Request donations</span>
                      <p className="text-neutral-600 mt-1">
                        Submit requests for the food items that best meet your needs
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1 text-[hsl(var(--secondary))]">4.</div>
                    <div>
                      <span className="font-semibold">Pick up and distribute</span>
                      <p className="text-neutral-600 mt-1">
                        Once approved, coordinate pickup and distribute the food to those in need
                      </p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Link href="/request">
                    <Button className="w-full bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary-dark))]">
                      Find Donations
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-8 rounded-lg border border-neutral-200 mb-16">
              <h3 className="text-xl font-heading font-semibold mb-6">
                Key Features of Our Platform
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex">
                  <div className="w-10 h-10 bg-[hsl(var(--primary-light))] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="h-5 w-5 text-[hsl(var(--primary-dark))]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Real-Time Updates</h4>
                    <p className="text-neutral-600 text-sm">
                      Track donation status and requests in real-time
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-10 h-10 bg-[hsl(var(--secondary-light))] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-[hsl(var(--secondary-dark))]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Location-Based</h4>
                    <p className="text-neutral-600 text-sm">
                      Find food donations and organizations in your area
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-10 h-10 bg-[hsl(var(--accent-light))] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-[hsl(var(--accent-dark))]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Direct Communication</h4>
                    <p className="text-neutral-600 text-sm">
                      Seamless communication between donors and recipients
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-10 h-10 bg-[hsl(var(--primary-light))] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--primary-dark))]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Verification System</h4>
                    <p className="text-neutral-600 text-sm">
                      Trusted network of verified organizations and donors
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h3 className="text-xl font-heading font-semibold mb-6">
                Donation Guidelines
              </h3>
              <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                <h4 className="font-heading font-semibold mb-4">Acceptable Food Items</h4>
                <ul className="list-disc list-inside space-y-2 mb-6 text-neutral-700">
                  <li>Unopened packaged goods within expiration date</li>
                  <li>Fresh produce (fruits and vegetables)</li>
                  <li>Bakery items (bread, pastries)</li>
                  <li>Prepared meals (properly stored and handled)</li>
                  <li>Canned and dry goods</li>
                  <li>Dairy products (within expiration date)</li>
                </ul>

                <h4 className="font-heading font-semibold mb-4">Food Safety Guidelines</h4>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>Ensure all food items are safe for consumption</li>
                  <li>Store perishable items at appropriate temperatures</li>
                  <li>Provide accurate expiration or best-by dates</li>
                  <li>List any potential allergens in your food description</li>
                  <li>Package food properly to maintain freshness and prevent contamination</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-heading font-semibold mb-6">
                Ready to Get Started?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="px-8">
                    Create an Account
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="px-8">
                    Learn More About Us
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

export default HowItWorks;
