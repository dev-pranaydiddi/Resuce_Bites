import React, { useState, useEffect, useMemo } from 'react';
import { getAllDonations } from '@/lib/donation-api';
import DonationCard from './DonationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const DonationsList = ({ limit, showViewAll = false, filter }) => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch donations once
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getAllDonations()
      .then(data => {
        if (isMounted) setDonations(data);
      })
      .catch(err => {
        console.error('Failed to fetch donations:', err);
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Always compute filtered and displayed lists to keep hooks order
  const filtered = useMemo(() => {
    console.log(typeof(donations));
    return donations
      .filter(d => filter === 'all' || d.status === filter)
      .filter(d => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return (
          d.title.toLowerCase().includes(lower) ||
          d.description.toLowerCase().includes(lower) ||
          d.location.toLowerCase().includes(lower) ||
          (d.foodType && d.foodType.toLowerCase().includes(lower))
        );
      });
  }, [donations, filter, searchTerm]);

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: limit || 3 }).map((_, idx) => (
          <div key={idx} className="bg-neutral-100 rounded-lg overflow-hidden shadow-md">
            <Skeleton className="w-full h-48" />
            <div className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return <p className="text-center text-red-500">Failed to load donations.</p>;
  }

  return (
    <div>
      {/* Search bar when not limited */}
      {!limit && (
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <Input
            type="text"
            placeholder="Search donations..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* No results */}
      {displayed.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No donations found</h3>
          <p className="text-neutral-600">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'There are currently no donations available'}
          </p>
        </div>
      ) : (
        /* Donation grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayed.map(d => (
            <DonationCard key={d.id} donation={d} />
          ))}
        </div>
      )}

      {/* View all link */}
      {showViewAll && filtered.length > (limit || 0) && (
        <div className="mt-8 text-center">
          <Link
            to="/donate"
            className="text-[hsl(var(--primary))] font-semibold hover:text-[hsl(var(--primary-dark))] transition-colors flex items-center justify-center"
          >
            View All Donations
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
      )}
    </div>
  );
};

export default DonationsList;
