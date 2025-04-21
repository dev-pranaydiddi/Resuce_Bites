import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/donation-api";
import { Skeleton } from "@/components/ui/skeleton";

const ImpactStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    staleTime: 60 * 1000, // 1 minute
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg bg-neutral-100">
            {isLoading ? (
              <Skeleton className="h-12 w-32 mx-auto mb-2" />
            ) : (
              <div className="text-5xl font-bold text-[hsl(var(--primary))] mb-2">
                {stats?.mealsShared.toLocaleString()}
              </div>
            )}
            <p className="text-neutral-800 font-heading uppercase tracking-wider text-sm">
              Meals Shared
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-neutral-100">
            {isLoading ? (
              <Skeleton className="h-12 w-24 mx-auto mb-2" />
            ) : (
              <div className="text-5xl font-bold text-[hsl(var(--secondary))] mb-2">
                {stats?.activeDonors.toLocaleString()}
              </div>
            )}
            <p className="text-neutral-800 font-heading uppercase tracking-wider text-sm">
              Active Donors
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-neutral-100">
            {isLoading ? (
              <Skeleton className="h-12 w-16 mx-auto mb-2" />
            ) : (
              <div className="text-5xl font-bold text-[hsl(var(--accent))] mb-2">
                {stats?.partnerOrganizations.toLocaleString()}
              </div>
            )}
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
