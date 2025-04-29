import React from "react";
import useGetAppliedRequests from "@/hooks/useGetAppliedRequests";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useSelector } from "react-redux";

export default function MyRequests() {
  // custom hook fetches & stores in Redux: { requests, loading, error }
  useGetAppliedRequests();
  const { appliedRequests } = useSelector((store) => store.request);
  // console.log("appliedRequests", appliedRequests);
  if (!appliedRequests) {
    return <p className="text-center py-8">You have no requests</p>;
  }
  // const addressStr = [street, city, state, zip, country].filter(Boolean).join(", ");

  //   if (error) {
  //     return (
  //       <p className="text-center py-8 text-red-600">
  //         Failed to load requests: {error}
  //       </p>
  //     );
  //   }

  if (appliedRequests.length === 0) {
    return (
      <p className="text-center py-8">
        You haven’t applied to any donations yet.
      </p>
    );
  }

  return (
    <div className="h-screen flex justify-center">
      <div className="overflow-x-auto mt-12">
        <table className=" w-5xl divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead className="bg-gray-50">
            <tr >
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Applied At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  text-gray-500 uppercase">
                Donation Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appliedRequests.map((req) => (
              <tr key={req._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDistanceToNow(parseISO(req.createdAt), {
                    addSuffix: true,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {req.donation?.name || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <a href="  " className="text-blue-600 underline">
                  {[req.donation.pickUpAddress.street, req.donation.pickUpAddress.city, req.donation.pickUpAddress.state, req.donation.pickUpAddress.zip, req.donation.pickUpAddress.country].filter(Boolean).join(", ")}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      req.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : req.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : req.status === "FULFILLED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
