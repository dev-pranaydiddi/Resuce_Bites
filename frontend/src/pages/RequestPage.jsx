import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../App"; // adjust path
import {
  getDonation,
  getAllDonations,
  createRequest,
} from "../lib/donation-api"; // adjust path

export default function RequestPage() {
  const navigate = useNavigate();
  const { user, organization } = useContext(AuthContext);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const donationId = params.has("_id") ? parseInt(params.get("_id"), 10) : null;

  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pickupDetails, setPickupDetails] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    if (donationId) {
      getDonation(donationId)
        .then((d) => setSelectedDonation(d))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      getAllDonations()
        .then((list) => setDonations(list))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [donationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to request a donation.");
      return navigate("/login");
    }
    if (!organization) {
      return alert("You need an organization profile to request donations.");
    }
    if (pickupDetails.trim().length < 10) {
      return alert("Pickup details must be at least 10 characters.");
    }
    if (message.trim().length < 5) {
      return alert("Message must be at least 5 characters.");
    }

    setSubmitting(true);
    try {
      await createRequest({
        donationId,
        organizationId: organization.id,
        pickupDetails,
        message,
      });
      alert("Request submitted – thank you!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // 1) Donor cannot request
  if (user && user?.user !== "organization") {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-white rounded shadow p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-2">
            Organization Account Required
          </h2>
          <p className="mb-4">
            Your account is a donor. To request, you must register as an
            organization.
          </p>
          <div className="flex gap-4">
            <Link to="/donate">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Donate Food Instead
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 border rounded">
                Register as Organization
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2) Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 3) Single donation view + request form
  if (donationId && selectedDonation) {
    return (
      <div className="container mx-auto p-8 max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Request This Donation</h1>

        <div className="bg-white shadow rounded p-4 mb-6">
          <h2 className="text-xl font-semibold">{selectedDonation.title}</h2>
          <p className="text-gray-600">{selectedDonation.description}</p>
          <p className="mt-2">
            <strong>Quantity:</strong> {selectedDonation.quantity}
          </p>
          <p>
            <strong>Location:</strong> {selectedDonation.location}
          </p>
        </div>

        {!user ? (
          <div className="text-center mb-6">
            <p className="mb-4">Please log in to request this donation.</p>
            <Link to={`/login?redirect=/request?id=${donationId}`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded mr-2">
                Log In
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 border rounded">Register</button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Pickup Details</label>
              <textarea
                value={pickupDetails}
                onChange={(e) => setPickupDetails(e.target.value)}
                className="w-full border rounded p-2"
                rows={4}
                placeholder="e.g., I can pick up Tuesdays 10–12."
              />
            </div>
            <div>
              <label className="block mb-1">Message to Donor</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded p-2"
                rows={4}
                placeholder="Tell them how this helps your cause..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}

        <div className="mt-6">
          <Link to="/request">
            <button className="text-gray-600 hover:underline">
              &larr; Back to list
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // 4) Default: list all available donations
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Available Donations</h1>
      <ul className="space-y-4">
        {donations.map((d) => (
          <li
            key={d.id}
            className="bg-white shadow rounded p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{d.title}</h2>
              <p className="text-gray-600">
                {d.quantity} • {d.location}
              </p>
            </div>
            <Link to={`/request?id=${d.id}`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Request
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
