import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import OrganizationCard from "@/components/organizations/organization-card";

const PartnerOrganizations = () => {
  const { data: organizations, isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/users?type=organization"],
  });

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl mb-3">Partner Organizations</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Join these amazing organizations in our mission to reduce food waste and hunger.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="h-7 w-48 mt-4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-5 w-24 mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load organizations. Please try again later.</p>
          </div>
        ) : organizations && organizations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizations.map((organization) => (
              <OrganizationCard key={organization.id} organization={organization} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-600">No partner organizations yet.</p>
          </div>
        )}
        
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="inline-block bg-white border border-primary text-primary hover:bg-primary hover:text-white font-medium px-6 py-3 rounded-md transition-colors">
            <Link href="/register?type=organization">Join as an Organization</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PartnerOrganizations;
