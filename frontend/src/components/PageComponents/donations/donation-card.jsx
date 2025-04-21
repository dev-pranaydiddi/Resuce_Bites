import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const DonationCard = ({ donation }) => {
  // Helper to calculate expiration time
  const getExpirationText = (expiresAt) => {
    try {
      const expiration = new Date(expiresAt);
      const now = new Date();
      const diff = expiration.getTime() - now.getTime();
      const daysUntil = diff / (1000 * 60 * 60 * 24);
      if (daysUntil > 30) {
        return 'Long shelf life';
      }
      return `Expires in ${formatDistanceToNow(expiration, { addSuffix: false })}`;
    } catch {
      return 'Expiration unknown';
    }
  };

  // Create a placeholder image based on donation title
  const placeholderImage =
    `https://source.unsplash.com/600x400/?${encodeURIComponent(
      donation.title.split(' ')[0]
    )}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-neutral-200">
      <div className="h-48 overflow-hidden">
        <img
          src={donation.imageUrl || placeholderImage}
          alt={donation.title || 'Donation item'}
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
            <MapPin className="h-4 w-4 mr-1" />
            <span>{donation.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <time dateTime={new Date(donation.expiresAt).toISOString()}>
              {getExpirationText(donation.expiresAt)}
            </time>
          </div>
        </div>
        <Button
          asChild
          className="w-full text-center bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded transition-colors"
          aria-label="Request Donation"
        >
          <Link to={`/request?donationId=${donation.id}`}>Request Donation</Link>
        </Button>
      </div>
    </div>
  );
};

export default DonationCard;