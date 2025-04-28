import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dayjs from "dayjs";
import {
  LocalizationProvider,
  DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DONATION } from "@/Endpoints";
import { setSingleDonation } from "@/store/donationSlice";

export default function EditDonation() {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    foodType: "",
    amount: "",
    unit: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    expiryTime: "",
    lat: "",
    long: "",
  });

  // fetch existing donation
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${DONATION}/${donationId}`, {
          withCredentials: true,
        });
        const d = res.data.donation;
        if (!mounted) return;
        setForm({
          name: d.name || "",
          description: d.description || "",
          foodType: d.foodType || "",
          amount: d.quantity?.amount || "",
          unit: d.quantity?.unit || "",
          street: d.pickUpAddress?.street || "",
          city: d.pickUpAddress?.city || "",
          state: d.pickUpAddress?.state || "",
          zip: d.pickUpAddress?.zip || "",
          country: d.pickUpAddress?.country || "",
          expiryTime: d.expiryTime ? d.expiryTime.slice(0, 16) : "",
          lat: d.pickUpAddress?.Geolocation?.coordinates?.lat || "",
          long: d.pickUpAddress?.Geolocation?.coordinates?.long || "",
        });
        dispatch(setSingleDonation(d));
      } catch {
        toast.error("Failed to load donation");
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [donationId, dispatch]);

  // geocode URL builder
  const geocodeUrl = () => {
    const q = encodeURIComponent(`${form.street} ${form.city} ${form.state}`);
    const apiKey = import.meta.env.VITE_GEOCODE_API_KEY;
    return `https://geocode.maps.co/search?q=${q}&api_key=${apiKey}`;
  };

  // debounced address lookup
  useEffect(() => {
    const { street, city, state } = form;
    if (!street && !city && !state) {
      setNoResults(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(geocodeUrl());
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          const parts = first.display_name.split(",").map((p) => p.trim());
          const len = parts.length;
          setForm((f) => ({
            ...f,
            city: parts[len - 4] || f.city,
            state: parts[len - 3] || f.state,
            zip: parts[len - 2] || f.zip,
            country: parts[len - 1] || f.country,
            lat: parseFloat(first.lat),
            long: parseFloat(first.lon),
          }));
          setNoResults(false);
        } else {
          setNoResults(true);
        }
      } catch {
        setNoResults(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [form.street, form.city, form.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        foodType: form.foodType,
        quantity: { amount: parseFloat(form.amount), unit: form.unit },
        pickUpAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          Geolocation: {
            coordinates: { lat: form.lat, long: form.long },
          },
        },
        expiryTime: new Date(form.expiryTime).toISOString(),
      };
      const res = await axios.put(
        `${DONATION}/update/${donationId}`,
        payload,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Donation updated");
        dispatch(setSingleDonation(res.data.donation));
        navigate(`/donation/${donationId}`);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="w-64 h-48" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Edit Donation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Donation Name
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Food Type
            </label>
            <Input
              name="foodType"
              value={form.foodType}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <Input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <Input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Expiry Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Time
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={form.expiryTime ? dayjs(form.expiryTime) : null}
              onChange={(dt) =>
                setForm((f) => ({
                  ...f,
                  expiryTime: dt?.toISOString() || "",
                }))
              }
              renderInput={(params) => (
                <Input {...params} className="w-full" />
              )}
            />
          </LocalizationProvider>
        </div>

        {/* Address Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <Input
            name="street"
            value={form.street}
            onChange={handleChange}
            placeholder="123 Main St"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <Input
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <Input
              name="state"
              value={form.state}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ZIP
            </label>
            <Input name="zip" value={form.zip} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <Input
            name="country"
            value={form.country}
            onChange={handleChange}
          />
        </div>
        {noResults && (
          <p className="text-yellow-600 text-sm">
            No address suggestions—please refine street, city, or state.
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
