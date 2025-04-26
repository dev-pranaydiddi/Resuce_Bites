// src/pages/Register.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";
import { registerUser } from "../lib/donation-api";
import { Heart } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: { first: "", last: "" },
    phone: "",
    role: "",
    address: {
      orgName: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "INDIA",
      Geolocation: {
        coordinates: {
          lat: "",
          long: "",
        },
      },
    },
    bio: "",
  });

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Fetch all countries for dropdown
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => {
        const list = res.data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(list);
      })
      .catch((err) => console.error("Error fetching countries", err))
      .finally(() => setLoadingCountries(false));
  }, []);

  // Helper to build geocode URL
  function encodeUrl({ street, city, state }) {
    const q = encodeURIComponent(`${street} ${city} ${state}`);
    const API_KEY = import.meta.env.VITE_GEOCODE_API_KEY;
    console.log(`https://geocode.maps.co/search?q=${q}&api_key=${API_KEY}`);
    return `https://geocode.maps.co/search?q=${q}&api_key=${API_KEY}`;
  }

  // Debounced auto-fetch geocode on address fields change
  useEffect(() => {
    const { street, city, state } = userData.address;
    if (!street && !city && !state) return;

    const handler = setTimeout(() => {
      const url = encodeUrl({ street, city, state });
      axios
        .get(url)
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const first = res.data[0];
            const parts = first.display_name.split(",").map((p) => p.trim());
            const len = parts.length;
            const cityPart = parts[0] || "";
            const statePart = len >= 3 ? parts[len - 3] : "";
            const zipPart = len >= 2 ? parts[len - 2] : "";
            const countryPart = parts[len - 1] || "";

            setUserData((prev) => ({
              ...prev,
              address: {
                ...prev.address,
                city: cityPart,
                state: statePart,
                zip: zipPart,
                country: countryPart,
                Geolocation: {
                  coordinates: {
                    lat: first.lat,
                    long: first.lon,
                  },
                },
              },
            }));
            setNoResults(false);
          } else {
            setNoResults(true);
          }
        })
        .catch(() => setNoResults(true));
    }, 2000);

    return () => clearTimeout(handler);
  }, [
    userData.address.street,
    userData.address.city,
    userData.address.state,
  ]);

  const validate = () => {
    const errs = {};
    if (!/.+@.+\..+/.test(userData.email)) errs.email = "Valid email required";
    if (userData.password.length < 8) errs.password = "Min 8 characters";
    if (!userData.name.first.trim()) errs.first = "First name required";
    if (!userData.name.last.trim()) errs.last = "Last name required";
    if (!userData.role) errs.role = "Role required";
    if (!userData.address.country) errs.country = "Country required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const path = name.split(".");
    setUserData((prev) => {
      const copy = { ...prev };
      if (path.length === 1) {
        copy[name] = value;
      } else if (path[0] === "name") {
        copy.name[path[1]] = value;
      } else if (path[0] === "address") {
        copy.address[path[1]] = value;
      }
      return copy;
    });
    setErrors((prev) => ({ ...prev, [path[path.length - 1]]: "" }));
  };

  const handleSelectChange = (val, field) => {
    if (field === "role") {
      setUserData((prev) => ({ ...prev, role: val }));
      setErrors((prev) => ({ ...prev, role: "" }));
    } else if (field === "country") {
      setUserData((prev) => ({
        ...prev,
        address: { ...prev.address, country: val },
      }));
      setErrors((prev) => ({ ...prev, country: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await registerUser(userData);
      console.log(res);
      if (res.success) {
        login(res.user, res.organization);
        navigate("/dashboard");
      } else {
        toast.error(res?.response?.data?.message);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = ["DONOR", "VOLUNTEER", "RECIPIENT", "ADMIN"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-3xl font-extrabold">Create an Account</h2>
          <p className="text-gray-600">Join our community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div className="grid lg:grid-cols-2 gap-6">

        
          {/* User Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">User Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="p-3 border rounded"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="p-3 border rounded"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="name.first"
                  value={userData.name.first}
                  onChange={handleChange}
                  placeholder="First name"
                  className="p-3 border rounded"
                />
                {errors.first && (
                  <p className="text-red-500 text-sm">{errors.first}</p>
                )}
              </div>
              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="name.last"
                  value={userData.name.last}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="p-3 border rounded"
                />
                {errors.last && (
                  <p className="text-red-500 text-sm">{errors.last}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="p-3 border rounded"
                />
              </div>
              {/* Role */}
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={userData.role}
                  onValueChange={(v) => handleSelectChange(v, "role")}
                >
                  <SelectTrigger className="p-3 border rounded">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4 lg:border-l-2 lg:border-t-0 border-t-2 lg:pt-0 lg:pl-6 pl-0 pt-4">
            <h3 className="text-xl font-semibold">Address</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Org Name (RECIPIENT only) */}
              {userData.role === "RECIPIENT" && (
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    name="address.orgName"
                    value={userData.address.orgName}
                    onChange={handleChange}
                    placeholder="Organization name"
                    className="p-3 border rounded"
                  />
                </div>
              )}
              {/* Street */}
              <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  name="address.street"
                  value={userData.address.street}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="p-3 border rounded"
                />
              </div>
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="address.city"
                  value={userData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="p-3 border rounded"
                />
              </div>
              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="address.state"
                  value={userData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="p-3 border rounded"
                />
              </div>
              {/* Zip */}
              <div className="space-y-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  id="zip"
                  name="address.zip"
                  value={userData.address.zip}
                  onChange={handleChange}
                  placeholder="Postal code"
                  className="p-3 border rounded"
                />
              </div>
              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={userData.address.country}
                  onValueChange={(v) => handleSelectChange(v, "country")}
                >
                  <SelectTrigger className="p-3 border rounded">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-auto">
                    {loadingCountries ? (
                      <SelectItem key="loading" value="loading" disabled>
                        Loading countries…
                      </SelectItem>
                    ) : (
                      countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-red-500 text-sm">{errors.country}</p>
                )}
              </div>
            </div>

            {noResults && (
              <p className="text-yellow-700 text-sm">
                No address suggestions found. Please type more detail.
              </p>
            )}
          </div>
          </div>

          {/* Bio */}
          <div className=" flex flex-col space-y-4">

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="p-3 border rounded"
              />
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
              >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
              </div>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
