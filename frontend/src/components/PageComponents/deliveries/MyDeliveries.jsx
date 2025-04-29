import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { setMyDeliveries, setLoading as setDeliveriesLoading } from "@/store/deliverySlice";
import { updateDeliveryStatus } from "@/lib/apiRequests";
import { DELIVERY } from "@/Endpoints";

const NEXT = {
  ACCEPTED: ["PICKED_UP"],
  PICKED_UP: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  EXPIRED: []
};

export default function MyDeliveries() {
  const dispatch = useDispatch();
  const { myDeliveries, loading } = useSelector(s => s.delivery);
  const [changingId, setChangingId] = useState(null);

  // fetch volunteer's deliveries
  const fetchMyDeliveries = async () => {
    dispatch(setDeliveriesLoading(true));
    try {
      const res = await axios.get(`${DELIVERY}/my`, { withCredentials: true });
      // console.log(res);
      if (res.data.success) {
        dispatch(setMyDeliveries(res.data.deliveries));
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to load your deliveries");
    } finally {
      dispatch(setDeliveriesLoading(false));
    }
  };

  useEffect(() => {
    fetchMyDeliveries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setChangingId(id);
    try {
      const res = await updateDeliveryStatus(id, { status: newStatus });
      if (res.success) {
        toast.success(res.message);
        await fetchMyDeliveries();
      } else {
        toast.error(res.response.data.message);
      }
    } catch {
      toast.error("Could not update status");
    } finally {
      setChangingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded" />)}
      </div>
    );
  }

  if (!myDeliveries) {
    return (
      <p className="py-8 text-center text-gray-600">
        You have no assigned deliveries.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {myDeliveries.map(d => {
        const options = NEXT[d.status] || [];
        return (
          <div key={d._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{d.donation.name}</h4>
              <p className="text-sm text-gray-600">
                Recipient: {d.request.applicant.name.first} {d.request.applicant.name.last}
              </p>
              <p className="text-sm">
                Pickup: {[
                  d.donation.pickUpAddress.street,
                  d.donation.pickUpAddress.city,
                  d.donation.pickUpAddress.state
                ].filter(Boolean).join(", ")}
              </p>
              <p className="text-sm">
                Deliver to: {d.request.applicant.address.orgName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                value={d.status}
                onValueChange={(status) => handleStatusChange(d._id, status)}
                disabled={!options.length || changingId === d._id}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={d.status.replace("_"," ")} />
                </SelectTrigger>
                <SelectContent>
                  {options.map(opt => (
                    <SelectItem key={opt} value={opt}>
                      {opt.replace("_"," ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {changingId === d._id && (
                <Skeleton className="w-8 h-8 rounded-full" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
