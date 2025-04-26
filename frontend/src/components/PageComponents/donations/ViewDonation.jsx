import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapPin, Clock, Tag, BaggageClaim, Pencil, ArrowBigLeft } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { getDonation } from "@/lib/donation-api";

export default function ViewDonation() {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDonation() {
      try {
        const res = await getDonation(donationId);
        if (!res.success) throw new Error("Failed to fetch donation");
        setDonation(res.donation);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDonation();
  }, [donationId]);

  if (loading) return <p className="text-center py-8">Loading donation...</p>;
  if (error)
    return <p className="text-center text-red-600 py-8">Error: {error}</p>;
  if (!donation) return <p className="text-center py-8">No donation found.</p>;

  const {
    name,
    foodType,
    quantity: { amount, unit },
    pickUpAddress: { street, city, state, zip, country },
    expiryTime,
    status,
    donor,
    description,
    createdAt,
    _id,
  } = donation;

  const addressStr = [street, city, state, zip, country]
    .filter(Boolean)
    .join(", ");
  const expiryText = expiryTime
    ? formatDistanceToNow(parseISO(expiryTime), { addSuffix: true })
    : "No expiry";
  const createdText = createdAt
    ? formatDistanceToNow(parseISO(createdAt), { addSuffix: true })
    : "Recently";

  const isOwner = user?.user?.role === "DONOR" && user.user?._id === donor._id; 
  const getStatusBadge = () => {
    const base = "inline-block px-3 py-1 rounded-full text-xs font-semibold";
    const map = {
      AVAILABLE: "bg-green-100 text-green-800",
      RESERVED: "bg-yellow-100 text-yellow-800",
      IN_TRANSIT: "bg-blue-100 text-blue-800",
      DELIVERED: "bg-purple-100 text-purple-800",
      EXPIRED: "bg-gray-200 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return (
      <span className={`${base} ${map[status] || ""}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  const getFoodBadge = () => {
    const base =
      "inline-block px-3 py-1 rounded-full text-xs font-medium uppercase";
    const map = {
      FRUIT: "bg-green-200 text-green-900",
      VEGETABLE: "bg-yellow-200 text-yellow-900",
      DAIRY: "bg-blue-200 text-blue-900",
      BAKED_GOODS: "bg-purple-200 text-purple-900",
      MEAT: "bg-gray-200 text-gray-900",
      OTHERS: "bg-red-200 text-red-900",
    };
    return (
      <span className={`${base} ${map[foodType] || ""}`}>
        {foodType.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className=" max-w-full flex justify-center item-center h-screen  ">
      {/* Header */}
      <div className="h-[400px] max-w-2xl flex flex-col justify-center my-auto bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
      <div className="flex flex-col  md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">{name}</h1>
          <p className="text-sm text-gray-500">Posted {createdText}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Description */}
      {description && (
        <p className="text-neutral-700 mb-6 leading-relaxed">{description}</p>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-neutral-600" />
            {getFoodBadge()}
          </div>
          <div className="flex items-center gap-2">
            <BaggageClaim className="h-5 w-5 text-neutral-600" />
            <span className="text-neutral-800 font-semibold">
              {amount} {unit}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-neutral-600" />
            <span className="text-neutral-700 uppercase">{addressStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-600" />
            <span className="text-red-600">Expires {expiryText}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end space-x-6">
        {isOwner && (
          <Link to={`/donation/${_id}`}>
          <Button
            size="sm"
            variant="outline"
            className="bg-white text-black border-2  border-gray-400 hover:bg-gray-400 hover:text-white rounded-md w-full"
            >
            {<Pencil className="h-4 w-4" />}
            <p className="text-xs" >EDIT</p>
          </Button>
        </Link>
        )}
        <Button className="bg-white px-2 text-black border-2  border-gray-400 hover:bg-gray-400 hover:text-white rounded-md " size="md" variant="secondary" onClick={() => navigate(-1)}>
          {<ArrowBigLeft className="h-4 w-4" />}
          <p className="text-xs">Back</p>
        </Button>
      </div>
        </div>
    </div>
  );
}
