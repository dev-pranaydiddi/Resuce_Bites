import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const DonationCard = ({ donation, onRequest }) => {
  const getStatusBadge = () => {
    if (donation.isUrgent) {
      return <span className="badge-urgent">Urgent</span>;
    }
    
    if (donation.status === 'available') {
      return <span className="badge-new">New</span>;
    }
    
    if (donation.status === 'reserved') {
      return <span className="badge-verified">Reserved</span>;
    }
    
    return null;
  };
  
  const getTimeAgo = () => {
    try {
      const date = new Date(donation.createdAt);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-neutral-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {donation.imageUrl && (
        <img
          src={donation.imageUrl}
          alt={donation.title}
          className="w-full h-48 object-cover object-center"
        />
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-heading font-semibold text-xl">{donation.title}</h3>
          {getStatusBadge()}
        </div>
        <p className="text-neutral-600 mb-4">{donation.description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-[hsl(var(--primary))] mr-2" />
            <span className="text-sm text-neutral-600">{donation.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-[hsl(var(--accent))] mr-2" />
            <span className="text-sm text-neutral-600">Posted {getTimeAgo()}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-800 font-semibold">{donation.quantity}</span>
          {donation.status === 'available' && (
            onRequest ? (
              <Button
                onClick={onRequest}
                size="sm"
                className="bg-primary hover:bg-[hsl(var(--primary-dark))] text-white rounded-full"
              >
                Request
              </Button>
            ) : (
              <Link to={`/request?id=${donation.id}`}>  
                <Button
                  size="sm"
                  className="bg-primary hover:bg-[hsl(var(--primary-dark))] text-white rounded-full"
                >
                  Request
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;