// src/pages/Register.jsx
import React, { useState, useContext, useEffect } from "react";
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
      country: "",
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
        setCountries(
          res.data.map((c) => c.name.common).sort((a, b) => a.localeCompare(b))
        );
      })
      .catch((err) => console.error("Error fetching countries", err))
      .finally(() => setLoadingCountries(false));
  }, []);

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
      if (path.length === 1) copy[name] = value;
      else if (path[0] === "name") copy.name[path[1]] = value;
      else if (path[0] === "address") copy.address[path[1]] = value;
      return copy;
    });
    setErrors((prev) => ({ ...prev, [path[path.length - 1]]: "" }));
  };

  const handleSelectChange = (val, field) => {
    if (field === "role") setUserData((prev) => ({ ...prev, role: val }));
    else if (field === "country")
      setUserData((prev) => ({
        ...prev,
        address: { ...prev.address, country: val },
      }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()){
       console.log("Validation failed", errors);
        return;
      } setIsLoading(true);
    try {
      const res = await registerUser(userData);
      if (res.success) {
        login(res.user, res.organization);
        navigate("/dashboard");
      } else {
        setErrors(res.errors || {});
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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div className="flex flex-col items-center space-y-2">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-3xl font-extrabold">Create an Account</h2>
          <p className="text-gray-600">Join our community</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email & Password */}
          <div className="grid lg:grid-cols-2 space-y-6 lg:space-y-0 gap-6">
            <div className="grid space-y-6">
              <h3 className="text-xl font-semibold">User Details</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="name.first"
                    value={userData.name.first}
                    onChange={handleChange}
                    placeholder="First name"
                    className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                  />
                  {errors["name.first"] && (
                    <p className="text-red-500 text-sm">
                      {errors["name.first"]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="name.last"
                    value={userData.name.last}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                  />
                  {errors["name.last"] && (
                    <p className="text-red-500 text-sm">
                      {errors["name.last"]}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & Role */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={userData.role}
                    onValueChange={(v) => handleSelectChange(v, "role")}
                  >
                    <SelectTrigger
                      id="role"
                      className="w-full p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500 hover:border-red-500 transition"
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-red-200 rounded-lg shadow-lg mt-1">
                      {roles.map((r) => (
                        <SelectItem
                          key={r}
                          value={r}
                          className="text-red-700 hover:bg-red-50 hover:border-red-500 rounded"
                        >
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
            <div className="grid space-y-6 gap-6">
              <div className="space-y-4 lg:border-l-[2px] border-t-[2px] lg:pl-4 pt-4">
                <h3 className="text-xl font-semibold">Address</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {userData.role === "RECIPIENT" && (
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input
                        id="orgName"
                        name="address.orgName"
                        value={userData.address.orgName}
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
                      value={userData.address.street}
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
                      value={userData.address.city}
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
                      value={userData.address.state}
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
                      value={userData.address.zip}
                      onChange={handleChange}
                      placeholder="Zip code"
                      className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={userData.address.country}
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
                          <SelectItem key={1} value={1} disabled>
                            Loading countries…
                          </SelectItem>
                        ) : (
                          countries.map((c) => (
                            <SelectItem
                              key={c}
                              value={c}
                              className="text-gray-700 hover:bg-red-50 focus:border-red-500 focus:ring focus:ring-red-500 hover:border-red-500 focus:text-red-700rounded"
                            >
                              {c}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors["address.country"] && (
                      <p className="text-red-500 text-sm">
                        {errors["address.country"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Country */}

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="p-3 border border-red-200 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500"
            />
          </div>

          {/* Country field with loading state */}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
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
