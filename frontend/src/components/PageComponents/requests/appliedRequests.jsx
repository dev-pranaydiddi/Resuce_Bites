import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

import { getAppliedRequests } from "@/lib/apiRequests";
import {
  setAppliedRequests,
  setApplicants,
  acceptRequest,
} from "@/store/requestSlice";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { REQUEST } from "@/Endpoints";

export default function AppliedRequestsTable() {
  const dispatch = useDispatch();
  const { requestId } = useParams();
  const { applicants, loading } = useSelector((s) => s.request);
  const [localLoading, setLocalLoading] = useState(true);

  // 1️⃣ Fetch on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if(requestId){

          const res = await getAppliedRequests(requestId);
          if (!res.success) throw new Error(res.message);
          if (mounted) {
            // this action populates state.applicants
            dispatch(setApplicants(res.requests));
          }
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        mounted && setLocalLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [requestId, dispatch]);

  if (localLoading) {
    return <p className="text-center py-8">Loading requests...</p>;
  }

  if (applicants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xl font-semibold">No requests found</p>
        <p className="text-neutral-600">
          There are no applicants for this donation.
        </p>
      </div>
    );
  }

  // 2️⃣ Handler: call your API, then dispatch acceptRequest
  const statusHandler = async (status, id) => {
    try {
      const res = await axios.put(
        `${REQUEST}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );
      if (!res.data.success) throw new Error(res.data.message);
      toast.success(res.data.message);

      if (status === "ACCEPTED") {
        // accept one & reject all others in Redux
        dispatch(acceptRequest(id));
      } else {
        // if you ever want single reject:
        dispatch(updateApplicantStatus({ id, status }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Applicants for this donation</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map(({ _id, applicant, createdAt, status }) => {
            const date = createdAt.split("T")[0];
            const fullAddr = [
              applicant.address.street,
              applicant.address.city,
              applicant.address.state,
              applicant.address.zip,
              applicant.address.country,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <TableRow key={_id}>
                <TableCell>{date}</TableCell>
                <TableCell>
                  {applicant.name.first} {applicant.name.last}
                </TableCell>
                <TableCell>{applicant.address.orgName}</TableCell>
                <TableCell>{fullAddr}</TableCell>
                <TableCell className="text-right">
                  {status === "PENDING" ? (
                    <Popover>
                      <PopoverTrigger>
                        <MoreHorizontal className="cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="w-32">
                        {["ACCEPTED", "REJECTED"].map((st) => (
                          <div
                            key={st}
                            onClick={() => statusHandler(st, _id)}
                            className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                          >
                            {st.charAt(0) + st.slice(1).toLowerCase()}
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div
                      className={`inline-block px-3 py-1 rounded-full font-medium ${
                        status === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
