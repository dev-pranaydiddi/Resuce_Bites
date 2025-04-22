// ImpactStats.jsx
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ImpactStats = () => {
  const [stats, setStats] = useState({
    mealsShared: 0,
    activeDonors: 0,
    partnerOrganizations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/stats', { credentials: 'include' });

        if (!res.ok) {
          console.error('Stats fetch failed with status', res.status);
          return;
        }

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          console.error('Stats fetch invalid content type:', contentType);
          return;
        }

        const data = await res.json();
        if (isMounted) {
          setStats({
            mealsShared: data.mealsShared ?? 0,
            activeDonors: data.activeDonors ?? 0,
            partnerOrganizations: data.partnerOrganizations ?? 0,
          });
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const renderValue = (value, colorClass) =>
    isLoading ? (
      <Skeleton className="h-12 w-32 mx-auto mb-2" />
    ) : (
      <div className={`text-5xl font-bold ${colorClass} mb-2`}>
        {value.toLocaleString()}
      </div>
    );

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Meals Shared */}
          <div className="text-center p-6 rounded-lg bg-neutral-100">
            {renderValue(stats.mealsShared, 'text-[hsl(var(--primary))]')}
            <p className="text-neutral-800 font-heading uppercase tracking-wider text-sm">
              Meals Shared
            </p>
          </div>

          {/* Active Donors */}
          <div className="text-center p-6 rounded-lg bg-neutral-100">
            {renderValue(stats.activeDonors, 'text-[hsl(var(--secondary))]')}
            <p className="text-neutral-800 font-heading uppercase tracking-wider text-sm">
              Active Donors
            </p>
          </div>

          {/* Partner Organizations */}
          <div className="text-center p-6 rounded-lg bg-neutral-100">
            {renderValue(stats.partnerOrganizations, 'text-[hsl(var(--accent))]')}
            <p className="text-neutral-800 font-heading uppercase tracking-wider text-sm">
              Partner Organizations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
