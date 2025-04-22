import React from 'react';
import { useOrganizations } from '@/hooks/useApi';
import OrganizationCard from './OrganizationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

const iconTypes = ['heart', 'hands', 'home', 'utensils'];

const OrganizationsList = ({ limit, showViewAll = false }) => {
  const { data: organizations = [], loading, error } = useOrganizations();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: limit || 4 }).map((_, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
            <Skeleton className="h-5 w-28 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        Failed to load organizations.
      </p>
    );
  }

  const displayed = limit ? organizations.slice(0, limit) : organizations;

  return (
    <div>
      {displayed.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No organizations found</h3>
          <p className="text-neutral-600">There are currently no partner organizations</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {displayed.map((org, idx) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              iconType={iconTypes[idx % iconTypes.length]}
            />
          ))}
        </div>
      )}

      {showViewAll && organizations.length > (limit || 0) && (
        <div className="text-center">
          <Link
            to="/organizations"
            className="inline-flex items-center text-[hsl(var(--primary))] font-semibold hover:text-[hsl(var(--primary-dark))] transition-colors"
          >
            View All Partners
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

export default OrganizationsList;