import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { setMyDonations, setLoading as setDonationsLoading } from "@/store/donationSlice";
import { updateDonationStatus } from "@/lib/apiRequests";
import { DONATION } from "@/Endpoints";

const NEXT = {
  AVAILABLE:   ["CANCELLED"],
  RESERVED:    ["DELIVERED"],
  DELIVERED:   [],
  REJECTED:    [],
  CANCELLED:   [],
  EXPIRED:     [],
};

export default function MyDonations() {
  const dispatch = useDispatch();
  const { myDonations, loading } = useSelector((s) => s.donation);
  const [changingId, setChangingId] = useState(null);
  // fetch donor's own donations
  const fetchMyDonations = async () => {
    dispatch(setDonationsLoading(true));
    try {
      const res = await axios.get(`${DONATION}/my`, { withCredentials: true });
      // console.log(res.data.donations);
      if (res.data.success) {
        dispatch(setMyDonations(res.data.donations));
        // console.log(myDonations);
      } else {
        toast.error(res.response.data.message);
      }
    } catch {
      toast.error("Failed to load your donations");
    } finally {
      dispatch(setDonationsLoading(false));
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setChangingId(id);
    try {
      const res = await updateDonationStatus(id, { status: newStatus });
      if (res.success) {
        toast.success(res.message);
        await fetchMyDonations();
      } else {
        toast.error(res.response?.data?.message || "Could not update");
      }
    } catch {
      toast.error("Error updating donation status");
    } finally {
      setChangingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded" />
        ))}
      </div>
    );
  }

  if (!myDonations) {
    return (
      <p className="py-8 text-center text-gray-600">
        You haven't created any donations yet.
      </p>
    );
  }

  return (
    <div className=" flex  flex-col max-w-xl items-center justify-center mx-auto space-y-6">
      {myDonations.map((d) => {
        const options = NEXT[d.status] || [];
        return (
          <div
            key={d._id}
            className="bg-white p-4 w-xl rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <h4 className="font-semibold text-lg">{d.name}</h4>
              <p className="text-sm text-gray-600 mb-1">{d.description}</p>
              <p className="text-sm">
                <span className="font-medium">Pickup:</span>{" "}
                {[d.pickUpAddress.street, d.pickUpAddress.city, d.pickUpAddress.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="inline-block text-xs font-semibold mt-2 px-2 py-1 rounded
                bg-green-100 text-green-800">
                {d.status.replace("_", " ")}
              </p>
            </div>
            {/* <div className="flex items-center space-x-4">
              <Select
                value={d.status}
                onValueChange={(val) => handleStatusChange(d._id, val)}
                disabled={!options.length || changingId === d._id}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={d.status.replace("_", " ")} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {changingId === d._id && (
                <Skeleton className="w-8 h-8 rounded-full" />
              )}
            </div> */}
          </div>
        );
      })}
    </div>
  );
}
