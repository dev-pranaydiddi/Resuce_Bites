import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapPin, Clock, Tag, View } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { getDonation } from "@/lib/donation-api";

const ViewDonation = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await getDonation(donationId);
        console.log("res", res);
        if (!res.success) throw new Error("Failed to fetch donation");
        const data = res.donation;
        setDonation(data);
        console.log("data", data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, []);

  if (loading) return <p>Loading donation...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!donation) return <p>No donation found.</p>;

  const {
    name,
    foodType,
    quantity,
    pickUpAddress,
    expiryTime,
    status,
    donor,
    description,
    createdAt,
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

  const createdText = createdAt
    ? formatDistanceToNow(parseISO(createdAt), { addSuffix: true })
    : "No creation date";

  const isOwner =
    user?.user?.role === "DONOR" && user.user._id === donor._id;

  const getStatusBadge = () => {
    switch (status) {
      case "AVAILABLE":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Available</span>;
      case "RESERVED":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">Reserved</span>;
      case "IN_TRANSIT":
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">In Transit</span>;
      case "DELIVERED":
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">Delivered</span>;
      case "EXPIRED":
        return <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full">Expired</span>;
      case "CANCELLED":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-neutral-100 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{name}</h1>
        {getStatusBadge()}
      </div>



      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-neutral-600" />
          <span className="text-lg text-neutral-700 uppercase">{foodType}</span>
          <span className="ml-auto font-semibold">{quantity.amount} {quantity.unit}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-neutral-600" />
          <p className="text-sm text-neutral-600 uppercase">{addressStr}</p>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-red-600" />
          <span className="text-sm text-red-600">Expires {expiryText}</span>
        </div>
        

        <div>
          <h2 className="text-base font-medium">Donor:</h2>
          <p className="text-sm text-neutral-700">
            {donor.name.first} {donor.name.last}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {isOwner && (
          <Link to={`/donation/edit/${id}`}>
            <Button size="md" className="bg-primary hover:bg-primary-dark text-white">
              Edit Donation
            </Button>
          </Link>
        )}
        <Button size="md" variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default ViewDonation;  