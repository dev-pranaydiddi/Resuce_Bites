import React from "react";
import { MapPin, Clock, Tag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DonationCard = ({ donation, onRequest }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  // console.log("donation", user.user.role);
  const checkAuth = () => {
    // const user = useSelector((state) => state.auth.user);
    if (user == undefined || user == null) {
      navigate("/login");
    }
  };
  const {
    name,
    foodType,
    quantity,
    pickUpAddress,
    expiryTime,
    status,
    donor,
    _id,
  } = donation;

  const addressStr = [
    pickUpAddress.street,
    pickUpAddress.city,
    pickUpAddress.state,
    pickUpAddress.zip,
    pickUpAddress.country,
  ]
    .filter(Boolean)
    .join(", ");

  const expiryText = expiryTime
    ? formatDistanceToNow(parseISO(expiryTime), { addSuffix: true })
    : "No expiry";
  const userId = user?.user?._id;
  const donorId = donor?._id;
  console.log(userId, donorId);

  const getStatusBadge = () => {
    if (status === "AVAILABLE")
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          Available
        </span>
      );
    if (status === "RESERVED")
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
          Reserved
        </span>
      );
    if (status === "IN_TRANSIT")
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          In Transit
        </span>
      );
    if (status === "DELIVERED")
      return (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
          Delivered
        </span>
      );
    if (status === "EXPIRED")
      return (
        <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs">
          Expired
        </span>
      );
    if (status === "CANCELLED")
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
          Cancelled
        </span>
      );
    return null;
  };
  return (
    <div className="bg-neutral-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-semibold text-xl">{name}</h3>
          {getStatusBadge()}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-2 items-center">
            <Tag className="h-3 w-3 text-neutral-600" />
            <span className="text-xs text-neutral-600 uppercase">
              {foodType}
            </span>
          </div>
          <span className="text-xs ml-5 text-neutral-800 font-semibold">
            {quantity.amount} {quantity.unit}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-6 w-6 text-neutral-600" />
          <span className="text-xs text-neutral-600">
            {addressStr.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">Expires {expiryText}</span>
        </div>
        <div className="flex justify-end mb-3">
          <span className="text-xs text-right text-neutral-500">
            ~ {donor.name.first} {donor.name.last}{" "}
          </span>
        </div>
        <Link to={`/donation/${_id}`}>
          <Button
            size="sm"
            variant="outline"
            className="bg-black text-white border-2 border-black hover:bg-white hover:text-black rounded-md w-full"
          >
            {<Eye className="h-4 w-4 mr-1" />}
            <p className="text-xs" >VIEW</p>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DonationCard;
