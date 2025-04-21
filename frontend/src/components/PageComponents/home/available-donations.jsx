import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllDonations } from '@/lib/donation-api';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DonationCard from '@/components/donations/DonationCard';

const AvailableDonations = () => {
  // Fetch donations and filter to only "available"
  const { data: donations = [], isLoading, error } = useQuery({
    queryKey: ['donations', 'available'],
    queryFn: getAllDonations,
    select: data => data.filter(d => d.status === 'available'),
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold text-2xl md:text-3xl">Available Donations</h2>
          <Link to="/donations" className="text-primary font-medium hover:underline flex items-center">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-200"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load donations. Please try again later.</p>
          </div>
        ) : donations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.slice(0, 3).map(donation => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-600">No donations available at the moment.</p>
            <Link to="/donate" className="text-primary font-medium mt-2 inline-block">
              Be the first to donate!
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default AvailableDonations;
