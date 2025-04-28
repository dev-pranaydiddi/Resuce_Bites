import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPin,
  Clock,
  Tag,
  BaggageClaim,
  ArrowBigLeft,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getDonation,
  applyRequest,
  updateDonationStatus,
} from "@/lib/apiRequests";
import { setSingleDonation } from "@/store/donationSlice";
import { toast } from "sonner";
import useGetApplicants from "@/hooks/useGetApplicants";
import AppliedRequests from "../requests/AppliedRequests";
import axios from "axios";
import { DONATION } from "@/Endpoints";

const NEXT = {
  AVAILABLE:   ['RESERVE', 'REJECT', 'CANCEL'],
  RESERVED:    ['IN_TRANSIT'],
  IN_TRANSIT:  [],
  DELIVERED:   [],
  REJECT:    [],
  CANCEL:   [],
  EXPIRED:     [],
};
const STATUS = {
  AVAILABLE:   'AVAILABLE',
  RESERVE:'RESERVED',
  IN_TRANSIT:  'IN_TRANSIT',
  DELIVERED:   'DELIVERED',
  REJECT:    'REJECT',
  CANCEL:   'CANCELLED',
  EXPIRED:     'EXPIRED',
};


export default function ViewDonation() {
  const { donationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleDonation } = useSelector(s => s.donation);
  const currUser = useSelector(s => s.auth.user);
  const user = currUser.user || {};

  const [loadingDonation, setLoadingDonation] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // if(user.user.role ==='DONOR')
  const { applicants, loading: applicantsLoading, error: applicantsError } =
    useGetApplicants(donationId);

  const fetchAndStore = async () => {
    setLoadingDonation(true);
    try {
      const res = await getDonation(donationId);
      if (!res.success) throw new Error(res.message);
      dispatch(setSingleDonation(res.donation));
      setIsApplied(res.donation.requests?.some(r => r.applicant === user._id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingDonation(false);
    }
  };

  useEffect(() => {
    fetchAndStore();
  }, [donationId]);

  const handleApply = async () => {
    try {
      const res = await applyRequest(donationId);
      // console.log(res.data.data)
      if(res.success){
        toast.success(res.message);
        setIsApplied(true);
        dispatch(setSingleDonation({
          ...singleDonation,
          requests: [
            ...(singleDonation.requests || []),
            { applicant: user._id }
          ]
        }));
        navigate(`/request/${res.request._id}`);
      }
      else{
        toast.error(res.response.data.message)
      }
    } catch (err) {
      toast.error(err.message || "Failed to apply");
    }
  };

  const handleStatusChange = async e => {
    const statusVal = e.target.value;
    let status = STATUS[statusVal];
  
    setStatusUpdating(true);
    try {
      const res = await axios.put(
          `${DONATION}/status/${donationId}/update`,
          { status },
          { withCredentials: true }
        );
      // console.log(res.data);
      if (res.data.success){
        toast.success(res.data.message);
        await fetchAndStore();
      }else{
        toast.error(res.response.data.message)
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.scroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      toast.error(data?.message || err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loadingDonation || !singleDonation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-2xl p-6">
          <Skeleton className="h-8 mb-4 w-1/3" />
          <Skeleton className="h-4 mb-2 w-2/3" />
          <Skeleton className="h-48 mb-6" />
          <Skeleton className="h-4 mb-2" />
          <Skeleton className="h-4 mb-2" />
          <Skeleton className="h-4 mb-2" />
          <Skeleton className="h-8 mt-4 w-24" />
        </div>
      </div>
    );
  }

  const {
    name,
    foodType,
    quantity: { amount, unit } = {},
    pickUpAddress: { street, city, state, zip, country } = {},
    expiryTime,
    status,
    description,
    createdAt,
    donor,
    _id,
  } = singleDonation;

  const addressStr = [street, city, state, zip, country].filter(Boolean).join(", ");
  const expiryText = expiryTime
    ? formatDistanceToNow(parseISO(expiryTime), { addSuffix: true })
    : "No expiry";
  const createdText = createdAt
    ? formatDistanceToNow(parseISO(createdAt), { addSuffix: true })
    : "Recently";

  const isOwner = user.role === "DONOR" && user._id === donor._id;
  const isRecipient = user.role === "RECIPIENT";

  // mark expired if past expiryTime
  const now = new Date();
  const isPastExpiry = expiryTime && new Date(expiryTime) < now;
  console.log(new Date(expiryTime),now)
  console.log('isPastExpiry', isPastExpiry)
  const showExpired = isPastExpiry && status !== 'EXPIRED';
  const showCancelled = status === 'CANCELLED';

  const options = NEXT[status.toUpperCase()] || [];
  console.log('options',isRecipient && !showExpired && !showCancelled )

  return (
    <div className="max-w-full h-screen flex flex-col items-center space-y-10 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-lg">
        {/* Expiry banner */}
        {showExpired || showCancelled && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
            Donation has Expired or Cancelled by Donor
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-sm text-gray-500">Posted {createdText}</p>
          </div>
          {isOwner && !showExpired && !showCancelled ? (
            <select
              value={status}
              onChange={handleStatusChange}
              disabled={statusUpdating || options.length === 0 || showExpired}
              className="border rounded px-2 py-1"
            >
              <option disabled value={status}>
                {status.replace('_',' ')}
              </option>
              {options.map(s => (
                <option key={s} value={s}>
                  {s.replace('_',' ')}
                </option>
              ))}
            </select>
          ) : (
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                {
                  AVAILABLE: "bg-green-100 text-green-800",
                  RESERVED: "bg-yellow-100 text-yellow-800",
                  IN_TRANSIT: "bg-blue-100 text-blue-800",
                  DELIVERED: "bg-purple-100 text-purple-800",
                  REJECTED: "bg-gray-300 text-gray-800",
                  CANCELLED: "bg-red-100 text-red-800",
                  EXPIRED: "bg-gray-200 text-gray-800",
                }[status]
              }`}
            >
              {status.replace("_", " ")}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="mb-6 text-neutral-700">{description}</p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-neutral-600" />
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium uppercase bg-gray-100">
                {foodType.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BaggageClaim className="h-5 w-5 text-neutral-600" />
              <span className="font-semibold text-neutral-800">
                {amount} {unit}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-neutral-600" />
              <span className="uppercase text-neutral-700">{addressStr}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              <span className="text-red-600">Expires {expiryText}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-x-4">
          {isRecipient && !showExpired && !showCancelled && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleApply}
              disabled={isApplied}
            >
              {isApplied ? "Already Applied" : "Apply Request"}
            </Button>
          )}
          {
          isOwner&& !showExpired && !showCancelled && ( <Link to={`/donation/edit/${_id}`}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>)
          }
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowBigLeft className="inline-block mr-1" />
            Back
          </Button>
        </div>
      </div>

      {/* Donor’s view: applicants */}
      {isOwner && !showExpired && !showCancelled && (
        <div className="w-full max-w-2xl">
          <AppliedRequests
            requests={applicants}
            loading={applicantsLoading}
            error={applicantsError}
          />
        </div>
      )}
    </div>
  );
}
