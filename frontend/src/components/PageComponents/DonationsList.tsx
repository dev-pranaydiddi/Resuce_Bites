import { useQuery } from "@tanstack/react-query";
import { getAllDonations } from "@/lib/donation-api";
import DonationCard from "./DonationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DonationsListProps {
  limit?: number;
  showViewAll?: boolean;
  filter?: "available" | "all";
}

const DonationsList = ({ limit, showViewAll = false, filter = "available" }: DonationsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: donations, isLoading } = useQuery({
    queryKey: ["/api/donations"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(limit || 3)].map((_, idx) => (
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

  // Filter and search donations
  const filteredDonations = donations
    ?.filter(donation => {
      // Apply status filter if needed
      if (filter === "available") {
        return donation.status === "available";
      }
      return true;
    })
    ?.filter(donation => {
      // Apply search if provided
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        donation.title.toLowerCase().includes(searchLower) ||
        donation.description.toLowerCase().includes(searchLower) ||
        donation.location.toLowerCase().includes(searchLower) ||
        (donation.foodType && donation.foodType.toLowerCase().includes(searchLower))
      );
    }) || [];
  
  // Apply limit if provided
  const displayedDonations = limit ? filteredDonations.slice(0, limit) : filteredDonations;

  return (
    <div>
      {!limit && (
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <Input
            type="text"
            placeholder="Search donations by title, description, or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      {displayedDonations.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No donations found</h3>
          <p className="text-neutral-600">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : "There are currently no donations available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedDonations.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      )}
      
      {showViewAll && filteredDonations.length > limit! && (
        <div className="mt-8 text-center">
          <a 
            href="/donate" 
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default DonationsList;
