import { Link } from "wouter";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonationWithDonor } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface DonationCardProps {
  donation: DonationWithDonor;
}

const DonationCard = ({ donation }: DonationCardProps) => {
  // Helper to calculate expiration time
  const getExpirationText = (expiresAt: Date) => {
    try {
      const expiration = new Date(expiresAt);
      
      // Check if it's a long shelf life (more than 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      if (expiration > thirtyDaysFromNow) {
        return "Long shelf life";
      }
      
      return `Expires in ${formatDistanceToNow(expiration)}`;
    } catch (error) {
      return "Expiration unknown";
    }
  };
  
  // Create a placeholder image based on donation.title
  const placeholderImage = `https://source.unsplash.com/600x400/?${encodeURIComponent(donation.title.split(' ')[0])}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-200">
      <div className="h-48 overflow-hidden">
        <img 
          src={donation.imageUrl || placeholderImage}
          alt={donation.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{donation.title}</h3>
          <Badge variant="success" className="text-xs px-2 py-1 rounded-full">
            Available
          </Badge>
        </div>
        <p className="text-neutral-600 text-sm mb-3">{donation.description}</p>
        <div className="flex justify-between items-center text-sm text-neutral-500 mb-4">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{donation.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{getExpirationText(donation.expiresAt)}</span>
          </div>
        </div>
        <Button asChild className="w-full text-center bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded transition-colors">
          <Link href={`/request?donationId=${donation.id}`}>Request Donation</Link>
        </Button>
      </div>
    </div>
  );
};

export default DonationCard;
