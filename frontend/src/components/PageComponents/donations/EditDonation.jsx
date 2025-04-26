import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const EditDonation = () => {
  const { id } = useParams();
  const donationId = useParams().id;
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Redirect unauthorized users
  useEffect(() => {
    if (!user?.user || user.user.role !== "DONOR") {
      navigate("/login");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    name: "",
    foodType: "",
    quantity: { amount: "", unit: "" },
    pickUpAddress: { street: "", city: "", state: "", zip: "", country: "" },
    expiryTime: "",
    status: "AVAILABLE",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const res = await fetch(`/api/donations/${id}`, {
          method: "PUT",
          headers: { "Accept": "application/json" },
        });
        const contentType = res.headers.get("content-type") || "";

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Error ${res.status}`);
        }
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(`Expected JSON, got: ${text.substring(0, 100)}`);
        }

        const data = await res.json();
        setForm({
          name: data.name,
          foodType: data.foodType,
          quantity: { amount: data.quantity.amount, unit: data.quantity.unit },
          pickUpAddress: { ...data.pickUpAddress },
          expiryTime: data.expiryTime ? data.expiryTime.slice(0, 16) : "",
          status: data.status,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("quantity.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, quantity: { ...prev.quantity, [key]: value } }));
    } else if (name.startsWith("pickUpAddress.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({ ...prev, pickUpAddress: { ...prev.pickUpAddress, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: "PUT  ",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Update failed: ${res.status}`);
      }
      navigate(`/donation/${id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-neutral-100 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Donation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300"
            required
          />
        </div>

        {/* Food Type & Quantity */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Food Type</label>
            <input
              type="text"
              name="foodType"
              value={form.foodType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300"
              required
            />
          </div>
          <div className="flex-1 flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                name="quantity.amount"
                value={form.quantity.amount}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Unit</label>
              <input
                type="text"
                name="quantity.unit"
                value={form.quantity.unit}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300"
                required
              />
            </div>
          </div>
        </div>

        {/* Pickup Address */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-sm font-medium">Pickup Address</legend>
          {['street','city','state','zip','country'].map((field) => (
            <div key={field} className="mt-2">
              <label className="block text-sm font-medium capitalize">{field}</label>
              <input
                type="text"
                name={`pickUpAddress.${field}`}
                value={form.pickUpAddress[field]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300"
                required
              />
            </div>
          ))}
        </fieldset>

        {/* Expiry and Status */}
        <div>
          <label className="block text-sm font-medium">Expiry Time</label>
          <input
            type="datetime-local"
            name="expiryTime"
            value={form.expiryTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300"
          >
            {['AVAILABLE','RESERVED','IN_TRANSIT','DELIVERED','EXPIRED','CANCELLED'].map(s => (
              <option key={s} value={s}>{s.replace(/_/g,' ')}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditDonation;
