import React, { use } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Hero from '@/components/PageComponents/Hero';
import HowItWorksSection from '@/components/PageComponents/HowItWorksSection';
import DonationsList from '@/components/PageComponents/DonationsList';
// import OrganizationsList from '@/components/PageComponents/OrganizationsList';
// import TestimonialsList from '@/components/PageComponents/TestimonialsList';
import CallToAction from '@/components/PageComponents/CallToAction';

import useGetAllDonations from '@/hooks/useGetAllDonations';
import { store } from '@/store/store';

const Home = () => {
  useGetAllDonations();
  const { loading } = useSelector(store=>store.auth)
  const allDonations = useSelector((s) => s.donation.allDonations);

  return (
    <>
      <Helmet>
        <title>FoodShare - Connect, Donate, Nourish</title>
        <meta
          name="description"
          content="Connect with local organizations to donate surplus food or find resources for those in need."
        />
      </Helmet>
        {/* <div>
        <script src="https://static.elfsight.com/platform/platform.js" async></script>
        <div class="elfsight-app-59c95c12-59a0-4e70-836e-a8b6ad2a1172" data-elfsight-app-lazy></div>
        </div> */}
      <Hero />
      <HowItWorksSection />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-heading font-bold text-3xl text-neutral-800">
              Current Donations
            </h2>
            <Link
              to="/donate"
              className="text-[hsl(var(--primary))] font-semibold hover:text-[hsl(var(--primary-dark))] transition-colors flex items-center"
            >
              View All
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Pass loading down if you want skeletons */}
          <DonationsList
            limit={3}
            showViewAll={true}
            filter="AVAILABLE"
            loading={loading}
          />
        </div>
      </section>

      {/* <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
              Our Partner Organizations
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We work with these amazing organizations to distribute food where
              it's needed most.
            </p>
          </div>

          <OrganizationsList limit={4} showViewAll={true} />
        </div>
      </section> */}

      {/* <section className="py-16 bg-primary bg-opacity-5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
              What Our Community Says
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Hear from the people making a difference in our community.
            </p>
          </div>

          <TestimonialsList limit={3} />
        </div>
      </section> */}

      <CallToAction />
    </>
  );
};

export default Home;
