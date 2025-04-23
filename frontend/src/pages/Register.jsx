import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";
import { registerUser } from "../lib/donation-api";
import { Heart } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
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
      country: "",
      Geolocation: { coordinates: { lat: "", long: "" } },
    },
    bio: "",
  });

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const validate = () => {
    const errs = {};
    if (!/.+@.+\..+/.test(form.email)) errs.email = "Must be a valid email address";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!form.name.first.trim()) errs["name.first"] = "First name is required";
    if (!form.name.last.trim()) errs["name.last"] = "Last name is required";
    if (form.phone && !/^\+\d{1,3}\s?\d{4,14}$/.test(form.phone))
      errs.phone = "Must be a valid international phone number";
    if (!form.role) errs.role = "Role is required";
    if (!form.address.country) errs["address.country"] = "Country is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length === 1) {
      setForm((f) => ({ ...f, [name]: value }));
    } else if (keys[0] === "name") {
      setForm((f) => ({ ...f, name: { ...f.name, [keys[1]]: value } }));
    } else if (keys[0] === "address") {
      if (keys[1] === "Geolocation") {
        setForm((f) => ({
          ...f,
          address: {
            ...f.address,
            Geolocation: {
              ...f.address.Geolocation,
              coordinates: {
                ...f.address.Geolocation.coordinates,
                [keys[3]]: value,
              },
            },
          },
        }));
      } else {
        setForm((f) => ({
          ...f,
          address: { ...f.address, [keys[1]]: value },
        }));
      }
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (val, field) => {
    if (field === "role") {
      setForm((f) => ({ ...f, role: val }));
      setErrors((prev) => ({ ...prev, role: "" }));
    } else if (field === "country") {
      setForm((f) => ({ ...f, address: { ...f.address, country: val } }));
      setErrors((prev) => ({ ...prev, "address.country": "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const user = await registerUser(form);
      login(user);
      alert("Registration successful! Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to register.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = ["DONOR", "VOLUNTEER", "RECIPIENT", "ADMIN"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-3xl font-extrabold">Create an Account</h2>
          <p className="text-gray-600">Join our community</p>
        </div>

        

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email & Password */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="name.first"
                value={form.name.first}
                onChange={handleChange}
                placeholder="First name"
                className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
              />
              {errors["name.first"] && <p className="text-red-500 text-sm">{errors["name.first"]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="name.last"
                value={form.name.last}
                onChange={handleChange}
                placeholder="Last name"
                className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
              />
              {errors["name.last"] && <p className="text-red-500 text-sm">{errors["name.last"]}</p>}
            </div>
          </div>

          {/* Phone & Role */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={form.role} onValueChange={(v) => handleSelectChange(v, "role")}>
                <SelectTrigger id="role" className="w-full p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500 hover:border-red-500 transition">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-red-200 rounded-lg shadow-lg mt-1">
                  {roles.map((r) => (
                    <SelectItem key={r} value={r} className="text-red-700 hover:bg-red-50 hover:border-red-500 rounded">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
          </div>

          {/* Address & Country */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-xl font-semibold">Address</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {form.role === "RECIPIENT" && (
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    name="address.orgName"
                    value={form.address.orgName}
                    onChange={handleChange}
                    placeholder="Organization name"
                    className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  name="address.street"
                  value={form.address.street}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="address.city"
                  value={form.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="address.state"
                  value={form.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  id="zip"
                  name="address.zip"
                  value={form.address.zip}
                  onChange={handleChange}
                  placeholder="Zip code"
                  className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={form.address.country}
              onValueChange={(v) => handleSelectChange(v, "country")}
            >
              <SelectTrigger
                id="country"
                className="w-full p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500 hover:border-red-500 transition"
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-red-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {loadingCountries ? (
                  <SelectItem disabled>Loading countries...</SelectItem>
                ) : (
                  countries.map((c) => (
                    <SelectItem key={c} value={c} className="text-red-700 hover:bg-red-50 hover:border-red-500 rounded">
                      {c}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors["address.country"] && (
              <p className="text-red-500 text-sm">{errors["address.country"]}</p>
            )}
          </div>
            </div>

            {/* Geolocation */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  name="address.Geolocation.coordinates.lat"
                  value={form.address.Geolocation.coordinates.lat}
                  onChange={handleChange}
                  placeholder="Latitude"
                  className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long">Longitude</Label>
                <Input
                  id="long"
                  name="address.Geolocation.coordinates.long"
                  value={form.address.Geolocation.coordinates.long}
                  onChange={handleChange}
                  placeholder="Longitude"
                  className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
            />
          </div>


          {/* Country field with loading state */}

          <Button type="submit" className="w-full py-3" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}