import React from 'react';
import { MapPin, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const DonationCard = ({ donation, onRequest }) => {
  const user = useSelector((state) => state.auth.user);
  console.log("donation", user.user.role);
  const {
    name,
    foodType,
    quantity,
    pickUpAddress,
    expiryTime,
    status,
    _id
  } = donation;

  const addressStr = [pickUpAddress.street, pickUpAddress.city, pickUpAddress.state, pickUpAddress.zip, pickUpAddress.country]
    .filter(Boolean)
    .join(', ');

  const expiryText = expiryTime
    ? formatDistanceToNow(parseISO(expiryTime), { addSuffix: true })
    : 'No expiry';

  const getStatusBadge = () => {
    if (status === 'AVAILABLE') return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Available</span>;
    if (status === 'RESERVED') return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Reserved</span>;
    if (status === 'IN_TRANSIT') return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Transit</span>;
    if (status === 'DELIVERED') return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Delivered</span>;
    if (status === 'EXPIRED') return <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs">Expired</span>;
    if (status === 'CANCELLED') return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Cancelled</span>;
    return null;
  };

  return (
    <div className="bg-neutral-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-heading font-semibold text-xl">{name}</h3>
          {getStatusBadge()}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-4 w-4 text-neutral-600" />
          <span className="text-sm text-neutral-600 uppercase">{foodType}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-neutral-800 font-semibold">{quantity.amount} {quantity.unit}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-neutral-600" />
          <span className="text-sm text-neutral-600">{addressStr}</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-4 w-4 text-neutral-600" />
          <span className="text-sm text-neutral-600">Expires {expiryText}</span>
        </div>

        <div className="mt-auto">
          {status === 'AVAILABLE' && user.user.role === "RECIPIENT" ?(
              <Link to={`/request?id=${_id}`}>  
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary-dark text-white rounded-full w-full"
                >
                  Request
                </Button>
              </Link>
          ):(status === 'AVAILABLE' && user.user.role === "DONOR") ? (
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-dark text-white rounded-full w-full"
              onClick={() => onRequest(donation)}
            >
              Edit Donation
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;
